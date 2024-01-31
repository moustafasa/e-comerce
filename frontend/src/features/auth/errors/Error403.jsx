import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { useGetCurrentUserQuery } from "../authApiSlice";
import { Button } from "react-bootstrap";

const Error403 = () => {
  const { role } = useGetCurrentUserQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({ role: data?.role, ...rest }),
  });
  return (
    <div>
      <div>Error403</div>
      {role === "2001" ? (
        <Button variant="primary" as={Link} to={"/"}>
          go to home page
        </Button>
      ) : (
        role === "1996" && (
          <Button variant="primary" as={Link} to={"/dashboard/writer"}>
            go to writer page
          </Button>
        )
      )}
    </div>
  );
};

export default Error403;
