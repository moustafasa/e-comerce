import { FaBars } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleShrink } from "../../features/dashboard/dashboardSlice";

const TopBar = () => {
  const dispatch = useDispatch();

  return (
    <div className="top-bar  border-bottom p-3 text-capitalize d-flex align-items-center justify-content-between justify-content-md-start gap-3">
      dashboard
      <FaBars role="button" onClick={() => dispatch(toggleShrink())} />
    </div>
  );
};

export default TopBar;
