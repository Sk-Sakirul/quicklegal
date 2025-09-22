import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  FaUser,
  FaBook,
  FaClipboardList,
  FaFileAlt,
  FaBars,
  FaTimes,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";

const ProfileLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { name: "Account Details", path: "", icon: <FaUser /> },
    {
      name: "My Bookings",
      path: "my-bookings",
      roles: ["user"],
      icon: <FaBook />,
    },
    {
      name: "Advocate Bookings",
      path: "advocate-bookings",
      roles: ["advocate"],
      icon: <FaClipboardList />,
    },
    {
      name: "My Cases",
      path: "my-cases",
      roles: ["user"],
      icon: <FaFileAlt />,
    },
    {
      name: "My Templates",
      path: "my-templates",
      roles: ["user"],
      icon: <FaFileAlt />,
    },

    // Admin links
    {
      name: "Booking Stats",
      path: "admin/bookings",
      roles: ["admin"],
      icon: <FaChartBar />,
    },
    {
      name: "Advocate Stats",
      path: "admin/advocates",
      roles: ["admin"],
      icon: <FaUsers />,
    },
    {
      name: "Popular Cases",
      path: "admin/cases",
      roles: ["admin"],
      icon: <FaChartBar />,
    },
    {
      name: "All Users",
      path: "admin/users",
      roles: ["admin"],
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`bg-white shadow-md transition-transform duration-300 fixed md:sticky z-50 w-64 flex-shrink-0 top-0 left-0 md:top-16 md:h-screen ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex justify-end md:hidden p-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-700 text-xl"
            >
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-2 overflow-y-auto h-full">
            {links.map(
              (link) =>
                (!link.roles || link.roles.includes(user?.role)) && (
                  <NavLink
                    key={`${link.name}-${link.path}`}
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                      }`
                    }
                  >
                    {link.icon}
                    {link.name}
                  </NavLink>
                )
            )}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="md:hidden mb-4">
            <button
              className="px-3 py-2 bg-indigo-600 text-white rounded flex items-center gap-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars /> Menu
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
