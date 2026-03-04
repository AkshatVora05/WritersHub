import { publishBlogParamInput, PublishBlogInput } from './../../../common/src/index';
import { Variables } from './../middleware/authMiddleware';
import { Context } from "hono"
import { getPrisma } from "../lib/getPrisma"
import { CreateBlogInput, createBlogInput, deleteBlogParamInput, getAllBlogsParamInput, getOneBlogInput, getUsersBlogsParamInput, publishBlogInput, UpdateBlogBodyInput, updateBlogBodyInput, updateBlogParamInput } from '@voraakshat05/writers-hub';

type Bindings = {
    DATABASE_URL: string
}

export const createBlogController = async (c: Context<{
    Bindings: Bindings,
    Variables: Variables
}>) => {
    try{
        const body = await c.req.json<CreateBlogInput>();
        const { success } = createBlogInput.safeParse(body);

        if(!success){
            return c.json({
                success: false,
                message: "Invalid input data"
            }, 400);
        }

        const { title, content, published } = body;

        if(published && (title.trim() === "" || content.trim() === "")) {
            return c.json({
                success: false,
                message: "Title and content both are required to publish the blog"
            }, 400)
        }

        const userId = c.get("userId");

        const prisma = getPrisma(c.env.DATABASE_URL);

        await prisma.blog.create({
            data: {
                title,
                content,
                authorId: userId,
                published
            }
        });

        return c.json({
            success: true,
            message: `Blog added successfully and blog is now ${published ? "live" : "draft"}`
        }, 201);
    }
    catch (err){
        return c.json({
            success: false,
            message: "Internal server error"
        }, 500);
    }
}

export const updateBlogController = async (c: Context<{
    Bindings: Bindings,
    Variables: {
        userId: string
        id: string
    }
}>) => {
    try {
        const id = c.req.param("id");
        const updateBlogParamCheck = updateBlogParamInput.safeParse(id);

        if(!updateBlogParamCheck.success) {
            return c.json({
                success: false,
                message: "Invalid ID format"
            }, 400);
        }

        const body = await c.req.json<UpdateBlogBodyInput>();
        const updateBlogBodyCheck = updateBlogBodyInput.safeParse(body);

        if (!updateBlogBodyCheck.success) {
            return c.json({
                success: false,
                errors: updateBlogBodyCheck.error.errors, 
            }, 400);
        }

        const { title, content } = body;
        const authorId = c.get("userId");

        const prisma = getPrisma(c.env.DATABASE_URL);

        const result = await prisma.blog.updateMany({
            where: {
                id,
                authorId
            },
            data: {
                ...(title && {title}),
                ...(content && {content})
            }
        });

        if(result.count === 0) {
            return c.json({
                success: false,
                message: "Blog not found or unauthorized"
            }, 404);
        }

        return c.json({
            success: true,
            message: "Blog updated successfully"
        }, 200);
    }
    catch(err) {
        return c.json({
            success: false,
            message: "Internal server error"
        }, 500);
    }
}

export const publishBlogController = async (c: Context<{
    Bindings: Bindings
    Variables: {
        id: string
        userId: string
    }    
}>) => {
    try{
        const id = c.req.param("id");
        const { success } = publishBlogParamInput.safeParse(id);

        if(!success) {
            return c.json({
                success: false,
                message: "Invalid blog-id"
            }, 400);
        }

        const body = await c.req.json<PublishBlogInput>();
        const publishBlogInputCheck = publishBlogInput.safeParse(body);

        if(!publishBlogInputCheck.success) {
            return c.json({
                success: false,
                message: "Invalid request"
            }, 400)
        }

        const userId = c.get("userId");

        const prisma = getPrisma(c.env.DATABASE_URL);

        const blog = await prisma.blog.findUnique({
            where: {
                id
            },
            select: {
                authorId: true
            }
        });

        if(!blog){
            return c.json({
                success: false,
                message: "Blog not found"
            }, 404);
        }

        if(blog.authorId !== userId){
            return c.json({
                success: false,
                message: "Unauthorized access"
            }, 403);
        }

        await prisma.blog.update({
            where: {
                id
            },
            data: {
                published: body.publish
            }
        })

        return c.json({
            success: true,
            message: `Blog is now ${body.publish ? 'Live' : 'Draft'}`
        });
    }
    catch(err) {
        return c.json({
            success: false,
            message: "Internal server error"
        }, 500);
    }
}

export const getOneBlogController = async (c: Context<{
    Bindings: Bindings,
    Variables: {
        id: string,
        userId: string
    }
}>) => {
    try {
        const id = c.req.param('id');

        const { success } = getOneBlogInput.safeParse(id);

        if(!success) {
            return c.json({
                success: false,
                message: "Invalid blog-id"
            }, 400)
        }

        const userId = c.get("userId");

        const prisma = getPrisma(c.env.DATABASE_URL);

        const blog = await prisma.blog.findUnique({
            where: { 
                id
            },
            select: {
                id: true,
                title: true,
                content: true,
                authorId: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        if(!blog) {
            return c.json({
                success: false,
                message: "Blog not found"
            }, 404);
        }

        if(userId !== blog.authorId && !blog.published) {
            return c.json({
                success: false,
                message: "Blog not found"
            }, 404);
        }

        return c.json({
            success: true,
            message: "Blog found successfully",
            blog
        }, 200);
    }
    catch(err) {
        return c.json({
            success: false,
            message: "Internal server error"
        }, 500)
    }
}

export const getAllBlogsController = async (c: Context<{
    Bindings: Bindings,
    Variables: Variables
}>) => {
    try {
        const rawPage = c.req.query("page");
        const { success, data } = getAllBlogsParamInput.safeParse(rawPage);
        
        if(!success) {
            return c.json({
                success: false,
                message: "Invalid page number"
            }, 400);
        }

        const page = data;

        const prisma = getPrisma(c.env.DATABASE_URL);

        const limit = 10;
        const skip = (page - 1) * limit;

        const blogs = await prisma.blog.findMany({
            where: {
                published: true
            },
            orderBy: {
                title: "asc"
            },
            take: limit,
            skip: skip,
            select: {
                title: true,
                content: true,
                id: true,
                authorId: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return c.json({
            success: true,
            message: "All blogs retreived successfully",
            page,
            blogs
        });
    }
    catch(err) {
        return c.json({
            success: false,
            message: "Internal server error"
        }, 500)
    }
}

export const deleteBlogController = async (c: Context<{
    Bindings: Bindings,
    Variables: {
        id: string
        userId: string
    }
}>) => {
    try {
        const blogId = c.req.param("id");
        const { success } = deleteBlogParamInput.safeParse(blogId);

        if(!success) {
            return c.json({
                success: false,
                message: "Invalid ID format"
            }, 400);
        }

        const userId = c.get("userId");

        const prisma = getPrisma(c.env.DATABASE_URL);

        const blog = await prisma.blog.findUnique({
            where: {
                id: blogId,
            },
            select: {
                authorId: true
            }
        });

        if(!blog){
            return c.json({
                success: false,
                message: "Blog not found"
            }, 404);
        }

        if(blog.authorId !== userId){
            return c.json({
                success: false,
                message: "Unauthorized access"
            }, 403);
        }

        await prisma.blog.delete({
            where: {
                id: blogId
            }
        });

        return c.json({
            success: true,
            message: "Blog deleted successfully"
        }, 200)
    }
    catch(err) {
        return c.json({
            success: false,
            message: "Internal server error"
        }, 500);
    }
}

export const getUsersBlogsController = async (c: Context<{
    Bindings: Bindings,
    Variables: {
        userId: string
    }
}>) => {
    try {
        const rawPage = c.req.query('page');
        const { success, data } = getUsersBlogsParamInput.safeParse(rawPage);
        
        if(!success) {
            return c.json({
                success: false,
                message: "Invalid page number"
            }, 400);
        }

        const page = data;
        const userId = c.get('userId');

        const prisma = getPrisma(c.env.DATABASE_URL);

        const limit = 10;
        const skip = (page - 1) * limit;

        const blogs = await prisma.blog.findMany({
            where: {
                authorId: userId
            },
            orderBy: {
                title: "asc"
            },
            take: limit,
            skip: skip,
            select: {
                title: true,
                content: true,
                id: true,
                authorId: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return c.json({
            success: true,
            message: "All blogs retreived successfully",
            page,
            blogs
        }, 200);
    }
    catch(err) {
        return c.json({
            success: false,
            message: "Internal server error"
        }, 500);
    }
}