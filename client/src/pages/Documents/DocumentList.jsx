import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates } from "../../features/documentSlice";

const DocumentList = () => {
  const dispatch = useDispatch();
  const { templates, loading, error } = useSelector((state) => state.document);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center mt-6 text-indigo-600">Loading templates...</p>
    );
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (!templates || templates.length === 0)
    return <p className="text-center mt-6 text-gray-500">No templates found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">All Templates</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((doc) => (
          <div
            key={doc._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transform transition duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-700 rounded p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v4m0 0l-2-2m2 2l2-2m-2 2V6m6 12H6a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v9a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {doc.title}
              </h3>
            </div>

            {doc.description && (
              <p className="text-gray-600 mt-2 line-clamp-3">
                {doc.description}
              </p>
            )}

            {doc.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <a
                href={doc.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded transition"
              >
                View PDF
              </a>
              <a
                href={doc.pdfUrl}
                download
                className="text-indigo-700 border border-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded transition"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
