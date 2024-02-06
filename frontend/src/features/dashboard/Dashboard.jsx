import { Outlet } from "react-router-dom";
import SideBar from "../../components/dashboard/SideBar";
import TopBar from "../../components/dashboard/TopBar";
import "./Dashboard.scss";
import { useSelector } from "react-redux";
import { getShrink } from "./dashboardSlice";
import classNames from "classnames";

const Dashboard = () => {
  const shrink = useSelector(getShrink);
  const shrinkClass = classNames({ shrink });
  console.log(shrink);
  return (
    <div
      className={
        "min-vh-100 d-flex flex-column dashboard overflow-hidden " + shrinkClass
      }
    >
      <TopBar />
      <div className="d-flex flex-grow-1 w-100">
        <SideBar />
        <div className="p-3 flex-grow-1 w-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
