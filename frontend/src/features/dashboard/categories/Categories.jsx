import { Button } from "react-bootstrap";
import { useGetCategoriesQuery } from "./catApiSlice";
import { Link } from "react-router-dom";
import TableShow from "../../../components/dashboard/TableShow";

const Categories = () => {
  const { data: cats = [], isFetching } = useGetCategoriesQuery(undefined);

  const headers = [{ title: "title" }, { title: "image" }];

  const data = cats.map((cat) => ({
    ...cat,
    image: <img src={cat.image} width={"50px"} />,
  }));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-capitalize my-3">categories page</h2>
        <Button
          as={Link}
          to={"/dashboard/category/add"}
          className="text-capitalize"
        >
          add category
        </Button>
      </div>
      <TableShow
        loading={isFetching}
        headers={headers}
        data={data}
        deletePage={"categories"}
      />
    </div>
  );
};

export default Categories;
