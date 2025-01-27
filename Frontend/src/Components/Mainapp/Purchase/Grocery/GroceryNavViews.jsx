// eslint-disable-next-line no-unused-vars
import React from "react";
import CattleSaleList from "./GrocerySaleList";
import CreateCattleFeed from "./CreateGrocery";

const GroceryNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <CattleSaleList />;
      break;
    case 1:
      return <CreateCattleFeed />;
      break;

    default:
      break;
  }
};

export default GroceryNavViews;
