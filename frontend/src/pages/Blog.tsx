import { useParams } from "react-router-dom"
import { useBlog, useGetMe } from "../hooks/index";
import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { AppbarSkeleton } from "../components/AppbarSkeleton";
import { FullBlogSkeleton } from "../components/FullBlogSkeleton"

export const Blog = () => {
    const { id } = useParams<{ id: string }>();
    const { loading, blog } = useBlog({
        id: id || ""
    });
    const { isUserLoading, userData } = useGetMe();
    const addBlog = true;

    if (isUserLoading || loading || !blog) {
        return (
            <>
                <AppbarSkeleton addBlog={addBlog}/>
                <FullBlogSkeleton />
            </>
        );
    }

    return <>
        <div className="sticky top-0 z-50 bg-white/25 backdrop-blur-md shadow-sm">
            <Appbar authorName={userData.name || "Anonymous"} addBlog={addBlog}></Appbar>
        </div>
        <FullBlog blog={blog}></FullBlog>
    </>
}