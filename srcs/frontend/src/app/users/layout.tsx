import { UserContextProvider } from "@/context/UserContext";
import VerticalNavbar from "@/components/VerticalNavbar/VerticalNavbar";
import HorizontalNavbar from "@/components/HorizontalNavbar/HorizontalNavbar";
import NavBar from "@/components/NavBar/NavBar";
import "./layout.css";

export const metadata = {
  title: "User Dashboard",
  description: "User management and related features",
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserContextProvider>
      <div className="layout-container">
        <div className="verticalNavbarr">
          <VerticalNavbar />
        </div>
        <div className="main-content">
          <div className="horizontalNavbarr">
            <HorizontalNavbar />
          </div>
          <div className="navBarContainer">
            <NavBar />
          </div>
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
    </UserContextProvider>
  );
}