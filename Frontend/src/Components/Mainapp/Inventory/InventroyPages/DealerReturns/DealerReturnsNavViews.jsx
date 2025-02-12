// eslint-disable-next-line no-unused-vars
import React from "react";
import List from "./List";
import Create from "./Create";

// eslint-disable-next-line react/prop-types
const DealerReturnsNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <List />;
    case 1:
      return <Create />;

    default:
      break;
  }
};

export default DealerReturnsNavViews;
