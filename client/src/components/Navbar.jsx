import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth, logoutUser } from "../features/auth/authSlice";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // profile dropdown
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    dispatch(checkAuth);
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold">
              QuickLegal
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center space-x-6">
            {isAuthenticated && user?.role === "user" && (
              <>
                <NavLink
                  to="/advocates"
                  className={({ isActive }) =>
                    isActive ? "underline" : "hover:underline"
                  }
                >
                  Advocates
                </NavLink>
                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    isActive ? "underline" : "hover:underline"
                  }
                >
                  All Templates
                </NavLink>
                <NavLink
                  to="/case/new"
                  className={({ isActive }) =>
                    isActive ? "underline" : "hover:underline"
                  }
                >
                  Add New Case
                </NavLink>
              </>
            )}
            {isAuthenticated && user?.role === "advocate" && (
              <>
                <NavLink
                  to="/advocates"
                  className={({ isActive }) =>
                    isActive ? "underline" : "hover:underline"
                  }
                >
                  Advocates
                </NavLink>
                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    isActive ? "underline" : "hover:underline"
                  }
                >
                  All Templates
                </NavLink>
                {/* <NavLink
                  to="/case/new"
                  className={({ isActive }) =>
                    isActive ? "underline" : "hover:underline"
                  }
                >
                  Add New Case
                </NavLink> */}
              </>
            )}

            {/* {isAuthenticated && user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                "Admin Dashboard"
              </NavLink>
            )} */}
          </div>

          {/* Auth/Profile */}
          <div
            className="hidden md:flex md:items-center space-x-4 relative"
            ref={dropdownRef}
          >
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-900 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-blue-900 font-semibold rounded hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-900 font-bold hover:bg-gray-200 transition"
                >
                  {user?.name?.[0]?.toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
                    <p className="px-4 py-2 text-sm text-gray-600 border-b">
                      {user?.name}
                    </p>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated && user?.role === "user" && (
            <>
              <NavLink
                to="/advocates"
                onClick={() => setIsOpen(false)}
                className="block hover:underline"
              >
                Advocates
              </NavLink>
              <NavLink
                to="/documents"
                onClick={() => setIsOpen(false)}
                className="block hover:underline"
              >
                All Templates
              </NavLink>
              <NavLink
                to="/case/new"
                onClick={() => setIsOpen(false)}
                className="block hover:underline"
              >
                Add New Case
              </NavLink>
            </>
          )}
          {isAuthenticated && user?.role === "advocate" && (
            <>
              <NavLink
                to="/advocates"
                onClick={() => setIsOpen(false)}
                className="block hover:underline"
              >
                Advocates
              </NavLink>
              <NavLink
                to="/documents"
                onClick={() => setIsOpen(false)}
                className="block hover:underline"
              >
                All Templates
              </NavLink>
              {/* <NavLink
                to="/case/new"
                onClick={() => setIsOpen(false)}
                className="block hover:underline"
              >
                Add New Case
              </NavLink> */}
            </>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-900 transition mb-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 bg-white text-blue-900 font-semibold rounded hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-white text-blue-900 rounded hover:bg-gray-100 transition"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-white text-blue-900 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
