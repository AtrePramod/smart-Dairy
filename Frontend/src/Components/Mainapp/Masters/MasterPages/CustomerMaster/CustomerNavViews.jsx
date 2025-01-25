import React from "react";
import CreateCustomer from "./CreateCustomer";
import CustomerList from "./CustomerList";

const CustomerNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <CustomerList />;
      break;
    case 1:
      return <CreateCustomer />;
      break;

    default:
      break;
  }
};

export default CustomerNavViews;
