import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    let title = "PrintTech";

    if (path.startsWith("/projects")) {
      title = "PrintTech | Projects  ";
    } else if (path.startsWith("/customers")) {
      title = " PrintTech | Customers";
    } else if (path.startsWith("/reports")) {
      title = " PrintTech | Reports";
    } else if (path.startsWith("/settings")) {
      title = "PrintTech | Settings";
    } else if (path.startsWith("/notifications")) {
      title = "PrintTech | Notifications";
    } else if (path.startsWith("/trash")) {
      title = "PrintTech | Trash";
    } else if (path === "/dashboard") {
      title = "PrintTech | Dashboard";
    }

    document.title = title;
  }, [location.pathname]);

  return null;
};

export default RouteMeta;
