import { Appbar } from "../components/Appbar"
import { useBlog, useGetMe } from "../hooks/index";
import { AppbarSkeleton } from "../components/AppbarSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type ChangeEventHandler } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { EditorSkeleton } from "../components/EditorSkeleton";
import { ConfirmModal } from "../components/ConfirmModal";

export const UpdateBlog = () => {
    const { isUserLoading, userData } = useGetMe();
    const isAuthenticated = !!userData?.id;
    const addBlog = false;
    const { id } = useParams<{ id: string }>();
    const { loading, blog } = useBlog({
        id: id || "",
        enabled: isAuthenticated,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const navigate = useNavigate();
    const [ actionType, setActionType ] = useState<'publish' | 'draft' | 'delete' | null>(null);

    useEffect(() => {
        if(blog) {
            setTitle(blog.title);
            setContent(blog.content);
        }
    }, [ blog ]);

    async function publishBlog({ publish }: { publish: boolean }) {
        try {
            setIsLoading(true);
            await Promise.all([
                axios.put(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    title,
                    content
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                axios.patch(`${BACKEND_URL}/api/v1/blog/${id}/publish`, {
                    publish
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ])

            toast.success(
                publish ? "Blog published successfully" : "Draft saved successfully"
            );
            navigate('/blogs');
        }
        catch(err) {
            const axiosError = err as AxiosError<{ message: string }>;

            const errorMessage = axiosError.response?.data?.message || "Something went wrong"
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const res = await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}/delete`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(res.data.message);
            navigate('/blogs');
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || "An authentication error occured"
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isUserLoading || (isAuthenticated && (loading || !blog)) || isLoading) {
        return <div>
            <AppbarSkeleton addBlog={addBlog}></AppbarSkeleton>
            <EditorSkeleton></EditorSkeleton>
        </div>
    }

    return <div>
        <div>
            <Appbar authorName={userData.name || "Anonymous"} addBlog={addBlog}></Appbar>
        </div>
        <div className="flex justify-end mt-4 mr-8.5">
            <div className="mr-2">
                <button 
                className={`flex items-center justify-center p-2 transition-all duration-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                    isEditing 
                    ? "bg-black border-black text-white" 
                    : "bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
                aria-label={isEditing ? "Save changes" : "Edit post"} 
                onClick={() => setIsEditing((prev) => !prev)}
                >
                {isEditing ? (
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    >
                    <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                    </svg>
                )}
                </button>
            </div>
            <div className="flex items-center">
                <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full animate-pulse hover:cursor-default ${
                    blog?.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {blog?.published ? "Live" : "Draft"}
                </span>
            </div>
        </div>
        <div className="flex flex-col mt-4">
            <div className="flex justify-center">
                <div className="max-w-[90vw] w-full">
                    <input value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.target.value);
                    }} disabled={!isEditing} type="text" id="helper-text" aria-describedby="helper-text-explanation" className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 hover:border-black focus:outline-none disabled:hover:border-gray-300" placeholder="Title" />                
                    <div className="mt-2">
                        <TextEditor value={content} disabled={!isEditing} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setContent(e.target.value);
                        }}></TextEditor>
                        <div className="mt-3">
                            <div className="flex justify-between">
                                <div className="flex">
                                    <div>
                                        <button disabled={isLoading} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={() => setActionType('publish')}>
                                            Publish the Blog
                                        </button>
                                    </div>
                                    <div>
                                        <button disabled={isLoading} type="button" className="text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={() => setActionType('draft')}>
                                            Save as Draft
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button disabled={isLoading} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={() => setActionType('delete')}>
                                        Delete Blog
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ConfirmModal 
            isOpen={actionType !== null}
            onClose={() => setActionType(null)}
            title={
                actionType === 'publish' ? "Publish Blog" : 
                actionType === 'draft' ? "Save to Drafts" : 
                "Delete Blog"
            }
            message={
                actionType === 'publish' ? "Are you sure you want to publish this blog for everyone to see?" : 
                actionType === 'draft' ? "Are you sure you want to unpublish and save this as a draft?" : 
                "Are you sure you want to delete this blog? This action cannot be undone."
            }
            confirmText={
                actionType === 'publish' ? "Publish" : 
                actionType === 'draft' ? "Save Draft" : 
                "Delete"
            }
            isDanger={actionType === 'delete'}
            onConfirm={() => {
                if (actionType === 'publish') publishBlog({ publish: true });
                if (actionType === 'draft') publishBlog({ publish: false });
                if (actionType === 'delete') handleDelete();
            }}
        />
    </div>
}

function TextEditor({ 
    value,
    onChange,
    disabled
}: { 
    value: string,
    onChange: ChangeEventHandler<HTMLTextAreaElement>,
    disabled: boolean
}) {
    return <div>
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="w-full rounded-lg">
                    <label className="sr-only">Publish post</label>
                    <textarea value={value} onChange={onChange} disabled={disabled} id="editor" rows={8} className="block w-full px-0 text-sm text-gray-800 bg-white pl-2 border-gray-300 rounded-lg hover:border-black focus:outline-none disabled:hover:border-gray-300" placeholder="Write a blog..." required ></textarea>
                </div>
            </div>
        </div>
    </div>
}