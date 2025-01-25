import React from "react";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import Sales from "./Appnavviews/Sales/Sales";
// import MilkReports from "./Appnavviews/Reports/MilkReports";
import Payments from "./Appnavviews/Payments/Payments";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import PrivMilkCollection from "./Appnavviews/PrevCollection/PrivMilkCollection";
import CompleteMilkColl from "./Appnavviews/Milkcollection/CompleteMilkColl";
// import UpdateMilkCollection from "./Appnavviews/Milkcollection/UpdateMilkCollection";
// import MilkCollectionReport from "./Appnavviews/Reports/MilkCollectionReport";
import UpdateCollection from "./Appnavviews/Milkcollection/UpdateCollection";
import MilkCollectorsReports from "./Appnavviews/Reports/MilkCollectorsReports";

const AppNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <Milkcollection />;
      break;
    case 1:
      return <MilkSankalan />;
      break;
    // case 2:
    //   return <PrivMilkCollection />;
    //   break;
    case 2:
      return <CompleteMilkColl />;
      break;
    case 3:
      return <UpdateCollection />;
      break;
    case 4:
      return <SankalanReport />;
      break;
    case 5:
      return <MilkCollectorsReports />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
