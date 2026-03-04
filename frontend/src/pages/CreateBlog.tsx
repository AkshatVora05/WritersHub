import axios, { AxiosError } from "axios"
import { BACKEND_URL } from "../config"
import { useState, type ChangeEvent, type ChangeEventHandler } from "react"
import toast from "react-hot-toast";
import { Appbar } from "../components/Appbar";
import { useGetMe } from "../hooks/indes";
import { AppbarSkeleton } from "../components/AppbarSkeleton";
import { ConfirmModal } from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { CreateBlogSkeleton } from "../components/CreateBlogSkeleton";

export const CreateBlog = () => {
    const [ title, setTitle ] = useState<string>("");
    const [ content, setContent ] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const { isUserLoading, userData } = useGetMe();
    const addBlog = false;
    const [ actionType, setActionType ] = useState<'publish' | 'draft' | null>(null);
    const navigate = useNavigate();

    async function publishBlog({ publish }: { publish: boolean }) {
        try {
            setIsLoading(true);
            const res = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                    title,
                    content,
                    published: publish,
                    authorId: userData.id
                }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            toast.success(res.data.message);
            navigate('/blogs');
        }
        catch(err) {
            const axiosError = err as AxiosError<{ message: string }>;

            const errorMessage = axiosError.response?.data?.message || "An authentication error occured"
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    }

    if(isLoading || isUserLoading) {
        return <div>
            <AppbarSkeleton addBlog={addBlog}></AppbarSkeleton>
            <CreateBlogSkeleton></CreateBlogSkeleton>
        </div>
    }
    

    return <div>
        <div>
            <Appbar authorName={userData.name || "Anonymous"} addBlog={addBlog}></Appbar>
        </div>
        <div className="flex flex-col mt-8">
            <div className="flex justify-center">
                <div className="max-w-[90vw] w-full">
                    <input onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.target.value)
                    }} type="text" id="helper-text" aria-describedby="helper-text-explanation" className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 hover:border-black focus:outline-none" placeholder="Title" />                
                    <div className="mt-2">
                        <TextEditor onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setContent(e.target.value);
                        }}></TextEditor>
                        <div className="mt-3">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ConfirmModal 
            isOpen={actionType !== null}
            onClose={() => setActionType(null)}
            title={
                actionType === 'publish' ? "Publish Blog" : "Save to Drafts" 
            }
            message={
                actionType === 'publish' ? "Are you sure you want to publish this blog?" : "Are you sure you want to save this as a draft?"
            }
            confirmText={
                actionType === 'publish' ? "Publish" : "Save Draft" 
            }
            onConfirm={() => {
                if (actionType === 'publish') publishBlog({ publish: true });
                if (actionType === 'draft') publishBlog({ publish: false });
            }}
        />
    </div>
}

function TextEditor({ onChange }: {onChange: ChangeEventHandler<HTMLTextAreaElement>}) {
    return <div>
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="w-full rounded-lg">
                    <label className="sr-only">Publish post</label>
                    <textarea onChange={onChange} id="editor" rows={8} className="block w-full px-0 text-sm text-gray-800 bg-white pl-2 border-gray-300 rounded-lg hover:border-black focus:outline-none" placeholder="Write a blog..." required ></textarea>
                </div>
            </div>
        </div>
    </div>
}