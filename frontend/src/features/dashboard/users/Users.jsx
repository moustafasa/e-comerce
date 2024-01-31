import { Button, Table } from "react-bootstrap";

import { useGetUsersQuery } from "./usersApiSlice";
import { Form, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRoles } from "../../auth/authSlice";
import { useGetCurrentUserQuery } from "../../auth/authApiSlice";
import TableShow from "../../../components/dashboard/TableShow";
const Users = () => {
  const roles = useSelector(getRoles);
  const { data: users = [], isFetching } = useGetUsersQuery();
  const { currentUser } = useGetCurrentUserQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      currentUser: data?.email,
      ...rest,
    }),
  });
  const headers = [
    { title: "username", id: "name" },
    { title: "email", id: "email" },
    { title: "role", id: "role" },
  ];
  const data = users.map((user) => ({
    ...user,
    name: `${user.name} ${(user.email === currentUser && "( you )") || ""}`,
    role: roles[user.role],
    hideDelete: user.email === currentUser,
  }));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-capitalize my-3">user page</h2>
        <Button
          as={Link}
          to={"/dashboard/user/add"}
          className="text-capitalize"
        >
          add user
        </Button>
      </div>
      <TableShow
        loading={isFetching}
        headers={headers}
        data={data}
        deletePage={"users"}
      />
    </div>
  );
};

export default Users;
