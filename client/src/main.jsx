import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store.js";
// import Layout from "./components/Layout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <Layout> */}
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={2000} />
      {/* </Layout> */}
    </Provider>
  </StrictMode>
);
