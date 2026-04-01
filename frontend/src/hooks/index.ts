import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Blogs {
    title: string,
    content: string,
    id: string,
    authorId: string,
    published: boolean,
    createdAt: string,
    updatedAt: string,
    author: {
        name?: string,
        email: string
    }
}

export interface Blog {
    title: string,
    content: string,
    id: string,
    authorId: string,
    published: boolean,
    createdAt: string,
    updatedAt: string,
    author: {
        name?: string,
        email: string
    }
}

export const useBlog = ({ id, enabled = true }: { id: string, enabled?: boolean }) => {
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState<Blog>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!enabled || !id) return;

        async function getBlog() {
            try {
                setLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                setBlog(res.data.blog);
            }
            catch (err) {
                const axiosError = err as AxiosError<{ message: string }>;
                const errorMessage = axiosError.response?.data?.message || "An authentication error occurred";

                toast.error(errorMessage, { id: "auth-error" }); 

                if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/signin");
                }
            }
            finally {
                setLoading(false);
            }
        }

        getBlog();
    }, [ id, enabled, navigate ]);

    return { 
        loading,
        blog
    };
};

export const useBlogs = ({ page = 1, enabled = true }: {page?: number, enabled: boolean}) => {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ blogs, setBlogs ] = useState<Blogs[]>([]);
    const [ hasNext, setHasNext ] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(!enabled) {
            return;
        }
        async function getBlogs() {
            try{
                setLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const fetchedBlogs = res.data.blogs;
                setBlogs(fetchedBlogs);
                setHasNext(fetchedBlogs.length === 10);
            }
            catch(err) {
                const axiosError = err as AxiosError<{ message: string }>;

                const errorMessage = axiosError.response?.data?.message || "An authentication error occured"
                toast.error(errorMessage, { id: "auth-error" });

                if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/signin");
                }
            }
            finally {
                setLoading(false);
            }
        }

        getBlogs();
    }, [ page, enabled, navigate ]);

    return {
        loading,
        blogs,
        hasNext
    }
}

export const useUsersBlogs = ({ page=1, enabled=true }: { page: number, enabled: boolean }) => {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ blogs, setBlogs ] = useState<Blogs[]>([]);
    const [ hasNext, setHasNext ] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(!enabled) {
            return;
        }
        async function getBlogs() {
            try{
                setLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/v1/blog/myBlogs?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const fetchedBlogs = res.data.blogs;

                setBlogs(fetchedBlogs);
                setHasNext(fetchedBlogs.length === 10);
            }
            catch(err) {
                const axiosError = err as AxiosError<{ message: string }>;

                const errorMessage = axiosError.response?.data?.message || "An authentication error occured"
                toast.error(errorMessage, { id: "auth-error" });

                if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/signin");
                }
            }
            finally {
                setLoading(false);
            }
        }

        getBlogs();
    }, [ page, enabled, navigate ]);

    return {
        loading,
        blogs,
        hasNext
    }
}

export const useGetMe = () => {
    const [ isUserLoading, setIsUserLoading ] = useState<boolean>(false);
    const [ userData, setUserData ] = useState<{
        id: string
        name?: string
        email: string
    }>({
        id: "",
        name: "",
        email: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        async function getMe() {
            try {
                setIsUserLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setUserData(res.data.user);
            }
            catch(err) {
                const axiosError = err as AxiosError<{ message: string }>;

                const errorMessage = axiosError.response?.data?.message || "An authentication error occured"
                toast.error(errorMessage, { id: "auth-error" });

                if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/signin");
                }
            }
            finally {
                setIsUserLoading(false);
            }
        }

        getMe();
    }, [ navigate ]);

    return {
        isUserLoading,
        userData
    }
}