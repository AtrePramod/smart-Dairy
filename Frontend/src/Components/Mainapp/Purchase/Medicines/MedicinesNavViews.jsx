// eslint-disable-next-line no-unused-vars
import React from "react";
import Create from "./Create";
import List from "./List";

// eslint-disable-next-line react/prop-types
const MedicinesNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <List />;
    case 1:
      return <Create />;

    default:
      break;
  }
};

export default MedicinesNavViews;
