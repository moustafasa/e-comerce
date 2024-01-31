import { Nav } from "react-bootstrap";
import { FaUsers, FaPlus } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../features/auth/authApiSlice";

const SideBar = () => {
  const { role } = useGetCurrentUserQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({ role: data?.role, ...rest }),
  });

  const links = [
    { path: "users", title: "users", Icon: FaUsers, allowedRoles: ["1995"] },
    {
      path: "user/add",
      title: "add user",
      Icon: FaPlus,
      allowedRoles: ["1995"],
    },
    {
      path: "writer",
      title: "writer",
      Icon: FaPlus,
      allowedRoles: ["1995", "1996"],
    },
    {
      path: "categories",
      title: "categories",
      Icon: BiSolidCategory,
      allowedRoles: ["1995", "1999"],
    },
    {
      path: "category/add",
      title: "add category",
      Icon: FaPlus,
      allowedRoles: ["1995", "1999"],
    },
  ];

  return (
    <Nav
      variant="pills"
      className="side-bar border-end gap-3 flex-column pt-3 px-2 text-capitalize bg-dark"
    >
      {links.map(
        (link) =>
          link.allowedRoles.includes(role) && (
            <Nav.Item key={link.path}>
              <Nav.Link
                className="icon-link  w-100"
                to={link.path}
                as={NavLink}
              >
                <link.Icon className="fs-4" />
                <span className="link-text">{link.title}</span>
              </Nav.Link>
            </Nav.Item>
          )
      )}
    </Nav>
  );
};

export default SideBar;
