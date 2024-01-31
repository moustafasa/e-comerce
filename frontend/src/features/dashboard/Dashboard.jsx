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
  return (
    <div
      className={
        "min-vw-100 min-vh-100 dashboard d-flex flex-column " + shrinkClass
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
