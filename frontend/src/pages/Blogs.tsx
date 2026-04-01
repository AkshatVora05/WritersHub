import { useState } from "react";
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { useBlogs, useGetMe, useUsersBlogs } from "../hooks/index"
import { Link } from "react-router-dom";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { AppbarSkeleton } from "../components/AppbarSkeleton";
import { motion } from "framer-motion";

export const Blogs = () => {
    const { isUserLoading, userData } = useGetMe();
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    const [forYouPage, setForYouPage] = useState<number>(1);
    const [myBlogsPage, setMyBlogsPage] = useState<number>(1);

    const { loading: forYouLoading, blogs: forYouBlogs, hasNext: hasNextForYou } = useBlogs({ page: forYouPage, enabled: isAuthenticated });
    const { loading: myLoading, blogs: myBlogs, hasNext: hasNextMyBlogs } = useUsersBlogs({ page: myBlogsPage, enabled: isAuthenticated });

    const [ activeTab, setActiveTab ] = useState<"forYou" | "myBlogs">("forYou");


    const isLoading = isUserLoading || (activeTab === "forYou" ? forYouLoading : myLoading);
    const addBlog = true;

    if(isLoading) {
        return <div>
            <div className="sticky top-0 z-50 bg-white/25 backdrop-blur-md shadow-sm">
                <AppbarSkeleton addBlog={addBlog}/>
            </div>
            <div className="flex justify-center">
                <BlogsSkeleton/>
            </div>
        </div>
    }

    const blogsToShow = activeTab === "forYou" ? forYouBlogs : myBlogs;
    const currentPage = activeTab === "forYou" ? forYouPage : myBlogsPage;

    return <div>
        <div>
            <div className="sticky top-0 z-50 bg-white/25 backdrop-blur-md shadow-sm">
                <Appbar authorName={userData.name || "Anonymous"} addBlog={addBlog}/>
            </div>
            <div className="flex justify-center mt-4">
                <div className="flex gap-6">
                    <button
                    onClick={() => setActiveTab("forYou")}
                    className={`relative cursor-pointer pb-2 text-sm font-medium ${
                        activeTab === "forYou" ? "text-black" : "text-gray-500"
                    }`}
                    >
                    For You

                    {activeTab === "forYou" && (
                        <motion.div
                        layoutId="underline"
                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    </button>

                    <button
                    onClick={() => setActiveTab("myBlogs")}
                    className={`relative cursor-pointer pb-2 text-sm font-medium ${
                        activeTab === "myBlogs" ? "text-black" : "text-gray-500"
                    }`}
                    >
                    My Blogs

                    {activeTab === "myBlogs" && (
                        <motion.div
                        layoutId="underline"
                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    </button>
                </div>
            </div>
            <div className="flex justify-center">
                <div>
                    {blogsToShow.map(blog => (
                        <Link key={blog.id} to={activeTab === "myBlogs" ? `/updateBlog/${blog.id}` : `/blog/${blog.id}`}>
                            <BlogCard
                                title={blog.title}
                                content={blog.content}
                                authorName={blog.author.name || "Anonymous"}
                                publishedDate={new Date(blog.updatedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                                })
                            }/>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-5">
            <div className="flex">
                <button
                onClick={() => {
                    if (activeTab === "forYou") {
                        setForYouPage((p) => Math.max(1, p - 1));
                    }
                    else {
                        setMyBlogsPage((p) => Math.max(1, p - 1));
                    }
                }}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500"
                >
                <svg
                    className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                >
                    <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5H1m0 0 4 4M1 5l4-4"
                    />
                </svg>
                Previous
                </button>
                <button
                onClick={() => {
                    if (activeTab === "forYou" && hasNextForYou) {
                        setForYouPage((p) => p + 1);
                    }

                    if (activeTab === "myBlogs" && hasNextMyBlogs) {
                        setMyBlogsPage((p) => p + 1);
                    }
                }}
                disabled={
                    activeTab === "forYou" ? !hasNextForYou : !hasNextMyBlogs
                }
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500"
                >
                Next
                <svg
                    className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                >
                    <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                </svg>
                </button>
            </div>
            </div>
        </div>
    </div>
}