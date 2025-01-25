import React from "react";
import PrevCollForm from "./PrevCollForm";
import PrevCollectionList from "./PrevCollectionList";
import UploadCollection from "./UploadCollection";

const PrevCollViews = ({ index }) => {
  switch (index) {
    case 0:
      return <PrevCollForm />;
      break;
    case 1:
      return <PrevCollectionList />;
      break;
    case 2:
      return <UploadCollection />;
      break;
    default:
      break;
  }
};

export default PrevCollViews;
