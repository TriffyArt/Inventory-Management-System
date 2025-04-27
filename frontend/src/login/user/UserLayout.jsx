import { Outlet } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";

const UserLayout = () => {
  return (
    <div>
      <UserNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;