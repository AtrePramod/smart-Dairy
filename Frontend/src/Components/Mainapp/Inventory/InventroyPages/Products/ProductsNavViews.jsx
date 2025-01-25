// eslint-disable-next-line no-unused-vars
import React from "react";
import CreateProducts from "./CreateProducts";
import ProductsList from "./ProductsList";

// eslint-disable-next-line react/prop-types
const ProductsNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <ProductsList />;
    case 1:
      return <CreateProducts />;

    default:
      break;
  }
};

export default ProductsNavViews;
