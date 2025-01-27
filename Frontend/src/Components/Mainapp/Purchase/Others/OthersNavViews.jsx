// eslint-disable-next-line no-unused-vars
import React from "react";
import OthersSaleList from "./OthersSaleList";
import CreateOthers from "./CreateOthers";

const OthersNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <OthersSaleList />;
      break;
    case 1:
      return <CreateOthers />;
      break;

    default:
      break;
  }
};

export default OthersNavViews;
