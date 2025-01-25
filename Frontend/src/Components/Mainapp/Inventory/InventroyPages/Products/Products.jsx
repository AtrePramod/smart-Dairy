// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import ProductsNavlinks from "./ProductsNavlinks";
import ProductsNavViews from "./ProductsNavViews";

const Products = () => {
  // const dispatch = useDispatch();
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedDealersIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedDealersIndex", isselected);
  }, [isselected]);

  // useEffect(() => {
  //   localStorage.setItem("selectedCustIndex", isselected);
  // }, [isselected]);

  // useEffect(() => {
  //   dispatch(getMaxCustNo());
  // }, []);
  return (
    <>
      <div className="customer-master-container w100 h1 d-flex-col">
        <div className="customer-master-navigation w100 h10 d-flex bg3">
          <ProductsNavlinks
            isselected={isselected}
            setIsSelected={setIsSelected}
          />
        </div>
        <div className="customer-views w100 h90 d-flex center">
          <ProductsNavViews index={isselected} />
        </div>
      </div>
    </>
  );
};

export default Products;
