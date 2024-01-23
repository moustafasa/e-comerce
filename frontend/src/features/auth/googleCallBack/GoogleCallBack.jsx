import { useLocation } from "react-router-dom";
import { useLoginWithGoogleQuery } from "../authApiSlice";

const GoogleCallBack = () => {
  const location = useLocation();
  const { data } = useLoginWithGoogleQuery(location.search);
  console.log(data);
  return <div>GoogleCallBack</div>;
};

export default GoogleCallBack;
