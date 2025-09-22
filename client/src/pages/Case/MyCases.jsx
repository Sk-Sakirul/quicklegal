import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCases } from "../../features/caseSlice";

const MyCases = () => {
  const dispatch = useDispatch();
  const { myCases, fetchCasesLoading, fetchCasesError } = useSelector(
    (state) => state.case
  );

  const [myCasesPage, setMyCasesPage] = useState(1);
  const [similarCasesPage, setSimilarCasesPage] = useState(1);
  const casesPerPage = 4;

  useEffect(() => {
    dispatch(fetchMyCases());
  }, [dispatch]);

  if (fetchCasesLoading)
    return <p className="text-center mt-6">Loading cases...</p>;
  if (fetchCasesError)
    return <p className="text-center mt-6 text-red-600">{fetchCasesError}</p>;

  if (!myCases || myCases.length === 0)
    return <p className="text-center mt-6">No cases found</p>;

  const allSimilarCases = myCases.flatMap((c) => c.relatedCases || []);

  // Pagination logic
  const paginate = (array, page) => {
    const start = (page - 1) * casesPerPage;
    return array.slice(start, start + casesPerPage);
  };

  const totalMyCasesPages = Math.ceil(myCases.length / casesPerPage);
  const totalSimilarCasesPages = Math.ceil(
    allSimilarCases.length / casesPerPage
  );

  const getTagColor = (tag) => {
    const colors = [
      "bg-indigo-200 text-indigo-800",
      "bg-green-200 text-green-800",
      "bg-yellow-200 text-yellow-800",
      "bg-pink-200 text-pink-800",
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Section 1: My Cases */}
      <section>
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          My Registered Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginate(myCases, myCasesPage).map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transform transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800">{c.title}</h3>
              <p className="text-gray-700 mt-3">{c.description}</p>
              <div className="flex flex-wrap mt-3 gap-2">
                {c.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`text-sm font-medium px-2 py-1 rounded ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* My Cases Pagination */}
        {totalMyCasesPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalMyCasesPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setMyCasesPage(i + 1)}
                className={`px-3 py-1 rounded border transition-colors ${
                  myCasesPage === i + 1
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-100 hover:text-indigo-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Similar Cases */}
      <section>
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          All Similar Cases
        </h2>
        {allSimilarCases.length === 0 ? (
          <p className="text-gray-500">No similar cases found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginate(allSimilarCases, similarCasesPage).map((rc) => (
                <div
                  key={rc._id}
                  className="border p-4 rounded-lg bg-white shadow-sm transform transition duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-800">{rc.title}</h3>
                  <p className="text-gray-600 mt-2">{rc.description}</p>
                  <div className="flex flex-wrap mt-2 gap-2">
                    {rc.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`text-sm font-medium px-2 py-1 rounded ${getTagColor(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Similar Cases Pagination */}
            {totalSimilarCasesPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalSimilarCasesPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSimilarCasesPage(i + 1)}
                    className={`px-3 py-1 rounded border transition-colors ${
                      similarCasesPage === i + 1
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-100 hover:text-indigo-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default MyCases;
