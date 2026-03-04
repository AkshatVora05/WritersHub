export const CreateBlogSkeleton = () => {
  return (
    <div className="animate-pulse">

      <div className="flex flex-col mt-8">
        <div className="flex justify-center">
          <div className="max-w-[90vw] w-full">

            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>

            <div className="mt-4 h-64 w-full bg-gray-200 rounded-lg"></div>

            <div className="mt-4 flex gap-3">
              <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};