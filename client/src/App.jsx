import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdvocateList from "./pages/Advocate/AdvocateList";
import AdvocateDetails from "./pages/Advocate/AdvocateDetails";
import BookingHistory from "./pages/Booking/BookingHistory";
import BookingForm from "./pages/Booking/BookingForm";
import DocumentUpload from "./pages/Documents/DocumentUpload";
import CaseForm from "./pages/Case/CaseForm";
import CaseSuggestions from "./pages/Case/CaseSuggestions";
import AdminDashboard from "./pages/Admin/AdminDashboard";
// import Reports from "./pages/Admin/Reports";
import Layout from "./components/Layout";
// import Profile from "./pages/Profile/Profile";
import DocumentList from "./pages/Documents/DocumentList";
import MyBookings from "./pages/Booking/MyBookings";
// import AdvocateBookings from "./pages/Booking/AdvocateBookings";
import ProfileLayout from "./pages/Profile/ProfileLayout";
import AccountDetails from "./pages/Profile/AccountDetails";
import MyCases from "./pages/Case/MyCases";
import MyTemplates from "./pages/Documents/MyTemplates";
import AdvocateBookings from "./pages/Advocate/AdvocateBookings";
import BookingStats from "./pages/Admin/BookingStats";
import AdvocateStats from "./pages/Admin/AdvocateStats";
import PopularCases from "./pages/Admin/PopularCases";
import UserManagement from "./pages/Admin/UserManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Client (Authenticated)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <ProfileLayout />,
            children: [
              { index: true, element: <AccountDetails /> }, // default
              { path: "my-bookings", element: <MyBookings /> },
              { path: "advocate-bookings", element: <AdvocateBookings /> },
              { path: "my-cases", element: <MyCases /> },
              { path: "my-templates", element: <MyTemplates /> },

              // Admin routes
              { path: "admin/bookings", element: <BookingStats /> },
              { path: "admin/advocates", element: <AdvocateStats /> },
              { path: "admin/cases", element: <PopularCases /> },
              { path: "admin/users", element: <UserManagement /> },
            ],
          },
          { path: "advocates", element: <AdvocateList /> },
          { path: "advocates/:id", element: <AdvocateDetails /> },
          { path: "bookings/my-bookings", element: <MyBookings /> },
          { path: "bookings/new", element: <BookingForm /> },
          { path: "documents", element: <DocumentList /> },
          { path: "documents/upload", element: <DocumentUpload /> },
          { path: "case/new", element: <CaseForm /> },
          // { path: "cases/suggestions", element: <CaseSuggestions /> },
        ],
      },

      // Advocate
      {
        element: <ProtectedRoute allowedRoles={["advocate"]} />,
        children: [
          // { path: "bookings", element: <AdvocateBookings /> },
          { path: "advocate/profile", element: <AdvocateDetails /> },
        ],
      },

      // Admin
      // {
      //   element: <ProtectedRoute allowedRoles={["admin"]} />,
      //   children: [
      //     {
      //       path: "admin",
      //       element: <AdminDashboard />,
      //       children: [
      //         { path: "bookings", element: <BookingStats /> },
      //         { path: "advocates", element: <AdvocateStats /> },
      //         { path: "cases", element: <PopularCases /> },
      //         { path: "users", element: <UserManagement /> },
      //       ],
      //     },
      //   ],
      // },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
