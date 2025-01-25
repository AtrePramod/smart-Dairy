import React, { useEffect, useState } from "react";
import PrevNavlinks from "./PrevNavlinks";
import PrevCollViews from "./PrevCollViews";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/PrevMilkCollection.css";

const PrivMilkCollection = () => {
   const [isselected, setIsSelected] = useState(
     parseInt(localStorage.getItem("milkcollTabIndex")) || 0
   );

   // Update localStorage whenever isselected changes
   useEffect(() => {
     localStorage.setItem("milkcollTabIndex", isselected);
   }, [isselected]);
  return (
    <div className="prevcollection-home-container w100 h1 d-flex">
      <div className="home-nav-views w80 d-flex a-center">
        <PrevCollViews index={isselected} />
      </div>
      <div className="header-nav-div w20 h1 d-flex-col">
        <PrevNavlinks isselected={isselected} setIsSelected={setIsSelected} />
      </div>
    </div>
  );
};

export default PrivMilkCollection;
