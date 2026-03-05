import type { Blog } from "../hooks/indes"
import { Avatar } from "./Avatar"

export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[90vw] pt-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="order-1 lg:order-2 lg:col-span-4">
            <div className="bg-slate-50 p-6 rounded-2xl shadow-sm">
              <div className="text-slate-700 text-lg font-semibold mb-4">
                About the Author
              </div>

              <div className="flex items-center gap-4">
                <Avatar name={blog.author.name || "Anonymous"} />

                <div>
                  <div className="text-lg font-bold">
                    {blog.author.name || "Anonymous"}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">
                    Random catch phrase about the author's ability to grab the user's attention
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1 lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              {blog.title}
            </h1>

            <div className="text-slate-500 mt-3 text-sm sm:text-base">
              {new Date(blog.updatedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>

            <div className="prose max-w-none pt-6 text-base sm:text-lg leading-relaxed">
              {blog.content}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}