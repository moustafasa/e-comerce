import { Nav } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <Nav
      variant="pills"
      className="side-bar border-end flex-column pt-3 px-2 text-capitalize bg-dark"
    >
      <Nav.Item>
        <Nav.Link className="icon-link  w-100" to={"users"} as={NavLink}>
          <FaUsers className="fs-4" />
          <span className="link-text">users</span>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default SideBar;
