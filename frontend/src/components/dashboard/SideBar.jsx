import { Nav } from "react-bootstrap";
import { FaUsers, FaPlus } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../features/auth/authApiSlice";
import { TfiWrite } from "react-icons/tfi";
import { RiUserAddFill } from "react-icons/ri";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  disableShrink,
  toggleShrink,
} from "../../features/dashboard/dashboardSlice";

const SideBar = () => {
  const getRoleSelector = createSelector(
    [(data) => data?.role, (data, rest) => rest],
    (role, rest) => ({ role, ...rest })
  );
  const { role } = useGetCurrentUserQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => getRoleSelector(data, rest),
  });

  const dispatch = useDispatch();

  const links = [
    { path: "users", title: "users", Icon: FaUsers, allowedRoles: ["1995"] },
    {
      path: "user/add",
      title: "add user",
      Icon: RiUserAddFill,
      allowedRoles: ["1995"],
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
      Icon: AiOutlineAppstoreAdd,
      allowedRoles: ["1995", "1999"],
    },
    {
      path: "products",
      title: "products",
      Icon: FaProductHunt,
      allowedRoles: ["1999", "1995"],
    },
    {
      path: "product/add",
      title: "add product",
      Icon: FaPlus,
      allowedRoles: ["1999", "1995"],
    },
    {
      path: "writer",
      title: "writer",
      Icon: TfiWrite,
      allowedRoles: ["1995", "1996"],
    },
  ];

  useEffect(() => {
    const blurHandler = (e) => {
      if (window.innerWidth < 767)
        if (!e.target.closest(".side-bar") && !e.target.closest(".top-bar")) {
          dispatch(disableShrink());
        }
    };
    document.addEventListener("click", blurHandler);
    return () => {
      document.removeEventListener("click", blurHandler);
    };
  }, []);

  return (
    <Nav
      variant="pills"
      className="side-bar border-end gap-3 flex-column pt-3 px-2 text-capitalize bg-dark flex-nowrap "
      onSelect={() => {
        if (window.innerWidth < 767) dispatch(toggleShrink());
      }}
    >
      {links.map(
        (link) =>
          link.allowedRoles.includes(role) && (
            <Nav.Item key={link.path}>
              <Nav.Link
                className="icon-link  w-100"
                to={link.path}
                eventKey={link.path}
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
