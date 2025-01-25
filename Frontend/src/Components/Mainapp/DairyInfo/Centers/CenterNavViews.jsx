import React, { useState } from "react";
import CenterList from "./CenterList";
import CreateCenter from "./CreateCenter";

const CenterNavViews = ({ index }) => {
  const [selectedCenter, setSelectedCenter] = useState(null);

  const handleEdit = (center) => {
    setSelectedCenter(center);
  };

  switch (index) {
    case 0:
      return <CenterList onEdit={handleEdit} />;
      break;
    case 1:
      return <CreateCenter selectedCenter={selectedCenter} />;
      break;

    default:
      break;
  }
};

export default CenterNavViews;
