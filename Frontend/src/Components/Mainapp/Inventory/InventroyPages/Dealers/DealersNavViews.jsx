// eslint-disable-next-line no-unused-vars
import React from "react";
import DealersList from "./DealersList";
import CreateDealers from "./CreateDealers";

// eslint-disable-next-line react/prop-types
const DealersNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <DealersList />;
    case 1:
      return <CreateDealers />;

    default:
      break;
  }
};

export default DealersNavViews;
