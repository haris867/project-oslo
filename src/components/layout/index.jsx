import Header from "./header";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-outlet">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
export default Layout;
