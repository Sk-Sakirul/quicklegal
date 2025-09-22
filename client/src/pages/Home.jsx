// src/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
    const advocates = [
      {
        id: 1,
        name: "Adv. Ramesh Kumar",
        specialization: "Criminal Law",
        hourlyRate: 1200,
      },
      {
        id: 2,
        name: "Adv. Priya Sharma",
        specialization: "Family Law",
        hourlyRate: 900,
      },
      {
        id: 3,
        name: "Adv. Arvind Menon",
        specialization: "Corporate Law",
        hourlyRate: 1500,
      },
      {
        id: 4,
        name: "Adv. Sneha Iyer",
        specialization: "Intellectual Property",
        hourlyRate: 2000,
      },
    ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white py-24 px-4 md:px-16 flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left mt-10 md:mt-0 z-10 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            QuickLegal - Your Trusted Legal Companion
          </h1>
          <p className="mb-6 text-lg sm:text-xl text-white/90">
            Find top advocates, book legal consultations online, and manage your
            cases effortlessly.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            {/* <Link
              to="/login"
              className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition shadow-lg"
            >
              Login
            </Link> */}
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 flex justify-center relative">
          <img
            src="./assets/hero.webp"
            alt="Legal Services"
            className="w-full max-w-lg rounded-xl "
          />
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <img
              src="./assets/find-advocate-icon.png"
              alt="Advocates"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Find Advocates</h3>
            <p>Search and connect with top legal professionals across India.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <img
              src="./assets/booking.png"
              alt="Booking"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Book Consultations</h3>
            <p>Schedule appointments online with your preferred advocate.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <img
              src="./assets/document_icon.png"
              alt="Documents"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Manage Documents</h3>
            <p>
              Upload, encrypt, and store your legal documents safely online.
            </p>
          </div>
        </div>
      </section>

      {/* Advocates Section */}
      <section className="py-16 px-4 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-12">Top Advocates</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {advocates.map((advocate) => (
            <div
              key={advocate.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <img
                src={`/assets/advocate${advocate.id}.png`}
                alt={`Advocate ${advocate}`}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-1">{advocate.name}</h3>
              <p className="text-gray-500 mb-2">{advocate.specialization}</p>
              <p className="text-gray-600 text-sm">
                Hourly Rate: ₹{advocate.hourlyRate}/hr
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
