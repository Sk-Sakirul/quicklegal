import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const links = [
    { name: "Booking Stats", path: "bookings" },
    { name: "Advocate Stats", path: "advocates" },
    { name: "Popular Cases", path: "cases" },
    { name: "Users", path: "users" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "font-bold text-blue-600" : "text-gray-700"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
