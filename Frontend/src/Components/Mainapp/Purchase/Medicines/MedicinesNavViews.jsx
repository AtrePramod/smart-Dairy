// eslint-disable-next-line no-unused-vars
import React from "react";
import CattleSaleList from "./MedicinesSaleList";
import CreateCattleFeed from "./CreateMedicines";

const MedicinesNavViews = ({ index }) => {
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

export default MedicinesNavViews;
