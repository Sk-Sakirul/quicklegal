import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdvocateDetails = () => {
  const { id } = useParams();
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState({});

  useEffect(() => {
    const fetchAdvocate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/advocates/${id}`,
          { withCredentials: true }
        );
        setAdvocate(response.data.advocate || response.data);
      } catch (error) {
        console.error("Failed to fetch advocate details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocate();
  }, [id]);

  const toggleDateSlots = (date) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  if (loading) return <p className="text-center mt-10">Loading details...</p>;
  if (!advocate)
    return <p className="text-center mt-10">Advocate not found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      {/* Header with avatar */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
        <img
          src="../assets/advocate3.png"
          alt="Avatar"
          className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-blue-900">
            {advocate.user?.name || advocate.name}
          </h1>
          <p className="text-gray-600 mt-1">{advocate.specialization}</p>
          <p className="text-gray-600">
            {advocate.experience} years experience
          </p>
          <p className="text-gray-600">${advocate.hourlyRate}/hr</p>
        </div>
      </div>

      {/* Availability */}
      {advocate.availability && advocate.availability.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Availability
          </h2>
          <div className="space-y-2">
            {advocate.availability.map((slot) => {
              const dateStr = new Date(slot.date).toLocaleDateString();
              return (
                <div key={slot.date} className="border rounded-md p-3">
                  <button
                    onClick={() => toggleDateSlots(dateStr)}
                    className="w-full text-left font-medium text-blue-600 hover:text-blue-800 transition flex justify-between items-center"
                  >
                    <span>{dateStr}</span>
                    <span>{expandedDates[dateStr] ? "▲" : "▼"}</span>
                  </button>
                  {expandedDates[dateStr] && (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slot.slots.map((time, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm text-center"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* About Section */}
      {advocate.about && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">About</h2>
          <p className="text-gray-600">{advocate.about}</p>
        </div>
      )}
    </div>
  );
};

export default AdvocateDetails;
