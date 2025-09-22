import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
      <p className="mb-2">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="mb-2">
        <strong>Role:</strong> {user.role}
      </p>

      {user.role === "user" && (
        <div className="mt-4 space-y-2">
          <h3 className="text-xl font-semibold">Your Dashboard</h3>
          <ul className="list-disc ml-6">
            <li>📄 Your Cases</li>
            <li>📅 Your Bookings</li>
            <li>📑 Uploaded Documents</li>
          </ul>
        </div>
      )}

      {user.role === "advocate" && (
        <div className="mt-4 space-y-2">
          <h3 className="text-xl font-semibold">Advocate Dashboard</h3>
          <ul className="list-disc ml-6">
            <li>👨‍⚖️ Cases assigned to you</li>
            <li>📅 Clients who booked your slots</li>
            <li>📑 Uploaded Legal Documents</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;