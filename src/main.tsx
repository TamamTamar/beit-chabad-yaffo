import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.tsx";
import { AuthContextProvider } from "./contexts/AuthContext.tsx";
import { FilterProvider } from "./contexts/FilterContext.tsx";
import { SearchProvider } from "./contexts/SearchContext.tsx";
import { AlertProvider } from "./contexts/AlertContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <FilterProvider>
      <SearchProvider>
        <AlertProvider>
          <RouterProvider router={router} />
        </AlertProvider>
      </SearchProvider>
    </FilterProvider>
  </AuthContextProvider>
);
