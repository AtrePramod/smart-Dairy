import React from "react";
import Milkcollection from "./Milkcollection";
import CompleteMilkColl from "./CompleteMilkColl";

const OptionViews = ({ index }) => {
  switch (index) {
    case 0:
      return <Milkcollection />;
      break;
    case 1:
      return <CompleteMilkColl />;
      break;
    default:
      break;
  }
};

export default OptionViews;
