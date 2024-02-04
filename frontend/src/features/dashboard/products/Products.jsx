import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TableShow from "../../../components/dashboard/TableShow";
import { useGetProductsQuery } from "./productsApiSlice";
import { useGetCategoriesQuery } from "../categories/catApiSlice";
import { createSelector } from "@reduxjs/toolkit";

const Products = () => {
  const { data: products = [], isFetching } = useGetProductsQuery();

  const headers = [
    { title: "title" },
    { title: "description" },
    { title: "price" },
    { title: "rating" },
  ];

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
        data={products}
        deletePage={"products"}
        isFetching={isFetching}
      />
    </div>
  );
};

export default Products;
