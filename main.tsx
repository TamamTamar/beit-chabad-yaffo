import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";

const router = createBrowserRouter([
  // Define your routes here
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
 
    <RouterProvider router={router} />

);