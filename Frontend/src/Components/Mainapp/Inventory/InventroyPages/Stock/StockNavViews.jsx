// eslint-disable-next-line no-unused-vars
import React from "react";
import CreateStock from "./CreateStock";
import StockList from "./StockList";

// eslint-disable-next-line react/prop-types
const StockNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <StockList />;
    case 1:
      return <CreateStock />;

    default:
      break;
  }
};

export default StockNavViews;
