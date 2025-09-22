import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdvocates } from "../../features/advocate/advocateSlice";

const AdvocateList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { advocates, isLoading, error } = useSelector(
    (state) => state.advocates
  );

  useEffect(() => {
    dispatch(fetchAdvocates());
  }, [dispatch]);

  if (isLoading)
    return <p className="text-center mt-10">Loading advocates...</p>;
  if (error)
    return <p className="text-red-600 text-center mt-10">Error: {error}</p>;
  if (!advocates.length)
    return <p className="text-center mt-10">No advocates found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {advocates.map((advocate) => (
        <div
          key={advocate._id}
          className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:shadow-2xl transition"
        >
          {/* Header with Avatar */}
          <div className="flex items-center mb-4">
            <img
              src={advocate.user?.profileImage || "../assets/advocate3.png"}
              alt={advocate.user?.name}
              className="w-20 h-20 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                {advocate.user?.name}
              </h2>
              <p className="text-gray-600">{advocate.specialization}</p>
              <p className="text-gray-600">
                {advocate.experience} yrs experience
              </p>
              <p className="text-gray-600">${advocate.hourlyRate}/hr</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/advocates/${advocate._id}`)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Details
            </button>
            <button
              onClick={() =>
                navigate(`/bookings/new?advocateId=${advocate._id}`)
              }
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Book
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvocateList;
