import { FaBars } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleShrink } from "../../features/dashboard/dashboardSlice";
import { Button, NavDropdown } from "react-bootstrap";
import { useGetCurrentUserQuery } from "../../features/auth/authApiSlice";
import { Form, Link } from "react-router-dom";

const TopBar = () => {
  const dispatch = useDispatch();
  const { user } = useGetCurrentUserQuery(undefined, {
    selectFromResult: ({ data, ...reset }) => {
      const user = data?.name;
      return { user, reset };
    },
  });

  return (
    <div className="top-bar d-flex border-bottom text-capitalize p-3  align-items-center justify-content-between">
      <div className=" d-flex align-items-center justify-content-between justify-content-md-start gap-3">
        dashboard
        <FaBars role="button" onClick={() => dispatch(toggleShrink())} />
      </div>
      <NavDropdown id="userDropDown" title={user}>
        <Form method="post" action="/logout">
          <NavDropdown.Item as={Button} type="submit">
            log out
          </NavDropdown.Item>
        </Form>
      </NavDropdown>
    </div>
  );
};

export default TopBar;
