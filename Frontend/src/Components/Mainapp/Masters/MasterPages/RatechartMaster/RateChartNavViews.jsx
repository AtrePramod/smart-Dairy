import React from "react";
import SaveRateChart from "./SaveRateChart";
import UpdateRatechart from "./UpdateRatechart";
import ApplyRatechart from "./ApplyRatechart";

const RateChartNavViews = ({ index, isSet, ratechart }) => {
  switch (index) {
    case 0:
      return <SaveRateChart />;
      break;
    case 1:
      return <UpdateRatechart isSet={isSet} ratechart={ratechart} />;
      break;
    case 2:
      return <ApplyRatechart isSet={isSet} ratechart={ratechart} />;
      break;

    default:
      break;
  }
};

export default RateChartNavViews;
