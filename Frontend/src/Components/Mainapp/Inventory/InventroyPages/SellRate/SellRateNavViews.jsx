// eslint-disable-next-line no-unused-vars
import React from "react";
import ProductsList from "./ProductsList";
// eslint-disable-next-line react/prop-types
const SellRateNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <ProductsList />;

    default:
      break;
  }
};

export default SellRateNavViews;
