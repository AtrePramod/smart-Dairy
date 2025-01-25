import React from "react";
import TodaysMilkReport from "./TodaysMilkReport";
import MilkCollectorsReports from "./MilkCollectorsReports";

const ReportsViews = ({index}) => {
  switch (index) {
    case 0:
      return <TodaysMilkReport />;
      break;
    case 1:
      return <MilkCollectorsReports />;
      break;
  }
};

export default ReportsViews;
