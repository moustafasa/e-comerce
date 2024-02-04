import { Button, Form, Table } from "react-bootstrap";
import { Link, Form as RouteForm } from "react-router-dom";
import { FaRegEdit as EditIcon } from "react-icons/fa";
import { RiDeleteBin6Line as DeleteIcon } from "react-icons/ri";

const TableShow = ({ loading, data = [], headers, deletePage }) => {
  const showUser = data.map((ele, id) => (
    <tr key={ele.id}>
      <td>{id + 1}</td>
      {headers.map((header) => (
        <td key={header.id || header.title + ele.id}>
          {ele[header.id || header.title]}
        </td>
      ))}
      <td>
        <div className="d-flex justify-content-center align-items-center">
          <Button
            as={Link}
            to={`edit/${ele.id}`}
            variant="none"
            size="sm"
            className="px-1 d-flex align-items-center"
          >
            <EditIcon className="text-success fs-4" role="button" />
          </Button>
          {!ele.hideDelete && (
            <Form
              as={RouteForm}
              method="delete"
              action={`/dashboard/delete/${deletePage}/${ele.id}`}
              navigate={false}
            >
              <Button
                variant="none"
                size="sm"
                className="px-1 d-flex align-items-center"
                type="submit"
                name="deleted"
                value={ele.id}
              >
                <DeleteIcon className="text-danger fs-4" role="button" />
              </Button>
            </Form>
          )}
        </div>
      </td>
    </tr>
  ));
  return (
    <div>
      <Table
        striped
        responsive
        className="text-center text-capitalize align-middle"
      >
        <thead>
          <tr>
            <th>id</th>
            {headers.map(({ title }, id) => (
              <th key={title + id}>{title}</th>
            ))}
            <th>options</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={12}>loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={12}>no {deletePage} found</td>
            </tr>
          ) : (
            showUser
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TableShow;
