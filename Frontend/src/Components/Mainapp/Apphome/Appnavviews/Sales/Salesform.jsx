import React from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Sales.css";

const Salesform = () => {
  return (
    <>
      <form action="" className="sales-form-container w100 h50 d-flex-col">
        <div className="sales-title w100 h10 d-flex">
          <h2 className="heading">Sales Details</h2>
        </div>
        <div className="sales-info-container w100 h70 d-flex-col">
          <div className="recipt-bill-details-div w100 d-flex a-center">
            <div className="form-div">
              <label className="text" htmlFor="reciptno">
                Recipt No:{" "}
              </label>
              <input
                className="form-inputs"
                type="number"
                name="reciptno"
                id=""
                placeholder="0000"
                required
              />
            </div>
            <div className="form-div">
              <label className="text" htmlFor="">
                Bill No:{" "}
              </label>
              <input
                className="form-inputs"
                type="number"
                required
                placeholder="0000"
              />
            </div>
            <div className="form-div">
              <label className="text" htmlFor="">
                Date:{" "}
              </label>
              <input
                className="form-inputs"
                type="Date"
                required
                placeholder="dd/mm/yy"
              />
            </div>
          </div>
          <div className="user-info-details w100 d-flex">
            <div className="form-div w30">
              <label htmlFor="" className="text">
                User Code:{" "}
              </label>
              <input type="text" className="form-inputs " placeholder="0000" />
            </div>
            <div className="form-div w70">
              <label htmlFor="" className="text">
                User Name:{" "}
              </label>
              <input
                type="text"
                className="form-inputs"
                placeholder="smart dairy"
              />
            </div>
          </div>
          <div className="product-details w100 d-flex">
            <div className="form-div">
              <label htmlFor="" className="text">
                product :
              </label>
              <select className="data  hover" name="" id="">
                <option selected>Select</option>
                <option>Option1</option>
                <option>Option2</option>
                <option>Option3</option>
                <option>Option4</option>
              </select>
            </div>
            <div className="form-div">
              <label htmlFor="" className="text">
                Quantity :
              </label>
              <input type="text" className="form-inputs" placeholder="0" />
            </div>
            <div className="form-div">
              <label htmlFor="" className="text">
                Rate :
              </label>
              <input type="text" className="form-inputs" placeholder="0.0" />
            </div>
          </div>
          <div className="added-product-details w100 d-flex-col ">
            <span className="heading">Added Products</span>
            <div className="added-prod-details w100-d-flex-col">
              <div className="prod-titles w100 d-flex">
                <span className="text w10">No.</span>
                <span className="text w40">Product Name</span>
                <span className="text w10">Qty</span>
                <span className="text w20">Price</span>
                <span className="text w10">Edit</span>
                <span className="text w10">Delete</span>
              </div>
              <div className="prod-values w100 d-flex">
                <span className="text w10">1</span>
                <span className="text w40">Product Name</span>
                <span className="text w10">1</span>
                <span className="text w20">100</span>
                <span className="text w10">
                  <AiFillEdit />
                </span>
                <span className="text w10">
                  <AiFillDelete />
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Salesform;
