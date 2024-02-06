import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TableShow from "../../../components/dashboard/TableShow";
import { useGetProductsQuery } from "./productsApiSlice";

const Products = () => {
  const { data: products = [], isFetching } = useGetProductsQuery();

  const headers = [
    { title: "title" },
    { title: "images" },
    { title: "description" },
    { title: "price" },
    { title: "rating" },
  ];

  console.log(products);
  const data = products.map((product) => ({
    ...product,
    images: (
      <div className="d-flex gap-2 flex-wrap">
        {product.images.map((img) => (
          <img key={img.id} src={img.image} width={"50px"} />
        ))}
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-capitalize my-3">products page</h2>
        <Button
          as={Link}
          to={"/dashboard/product/add"}
          className="text-capitalize"
        >
          add product
        </Button>
      </div>
      <TableShow
        loading={isFetching}
        headers={headers}
        data={data}
        deletePage={"products"}
        isFetching={isFetching}
      />
    </div>
  );
};

export default Products;
