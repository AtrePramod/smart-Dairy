// eslint-disable-next-line no-unused-vars
import React from "react";
import CattleSaleList from "./CattleSaleList";
import CreateCattleFeed from "./CreateCattleFeed";

const CattleFeedNavViews = ({ index }) => {
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

export default CattleFeedNavViews;
