import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./Avatar"
import toast from "react-hot-toast";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";

export const Appbar = ({ authorName, addBlog=true }: { authorName: string, addBlog?: boolean }) => {
    const navigate = useNavigate();
    const [ isLogoutModalOpen, setIsLogoutModalOpen ] = useState(false);
    
    return <div className="border-b flex justify-between px-4 md:px-8 py-3 shadow-lg">
            <div className="flex flex-col justify-center">
                <Link to={'/blogs'}>
                    <div className="text-2xl font-semibold">
                        WritersHub
                    </div>
                </Link>
            </div>
        <div className="flex">
            {addBlog && (
                    <div className="flex flex-col justify-center">
                        <Link to={'/publish'}>
                            <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-3">New</button>
                        </Link>
                    </div>
                )
            }
            
            <div className="flex flex-col justify-center">
                <Avatar name={authorName} size="big"></Avatar>
            </div>
            <div>
                <button 
                    className="ml-5 flex items-center justify-center p-2 text-gray-600 transition-all duration-200 border border-gray-300 rounded-md hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" 
                    aria-label="Log out"
                    onClick={() => setIsLogoutModalOpen(true)}
                    >
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
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </div>
        <ConfirmModal 
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            title="Log Out"
            message="Are you sure you want to log out of your account?"
            confirmText="Log Out"
            isDanger={true}
            onConfirm={() => {
                localStorage.removeItem('token');
                toast.success("Logout Successful");
                navigate('/signin');
            }}
        />
    </div>
}