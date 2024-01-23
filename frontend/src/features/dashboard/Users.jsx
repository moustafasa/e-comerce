import { Table } from "react-bootstrap";

const Users = () => {
  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>email</th>
            <th>options</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
};

export default Users;
