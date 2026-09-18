import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    let title = "PrintTech";

    if (path.startsWith("/projects")) {
      title = "Projects | PrintTech";
    } else if (path.startsWith("/customers")) {
      title = "Customers | PrintTech";
    } else if (path.startsWith("/reports")) {
      title = "Reports | PrintTech";
    } else if (path.startsWith("/settings")) {
      title = "Settings | PrintTech";
    } else if (path.startsWith("/notifications")) {
      title = "Notifications | PrintTech";
    } else if (path.startsWith("/trash")) {
      title = "Trash | PrintTech";
    } else if (path === "/") {
      title = "Dashboard | PrintTech";
    }

    document.title = title;
  }, [location.pathname]);

  return null;
};

export default RouteMeta;
