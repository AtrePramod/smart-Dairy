import React from "react";
import CollectionReport from "./CollectionReport";
import MilkReport from "./Report";

const Reportviews = ({ index }) => {
  switch (index) {
    case 0:
      return <CollectionReport />;
      break;
    case 1:
      return <MilkReport />;
      break;

    default:
      break;
  }
};

export default Reportviews;
