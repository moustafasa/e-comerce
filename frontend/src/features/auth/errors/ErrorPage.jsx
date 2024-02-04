import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Error403 from "./Error403";
import Err404 from "./Err404";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);
  if (isRouteErrorResponse(error)) {
    if (error.status === 403) return <Error403 />;
    else if (error.status === 404) return <Err404 />;
  }
};

export default ErrorPage;
