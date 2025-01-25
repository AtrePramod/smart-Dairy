import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodaysMilk } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import Spinner from "../../../../Home/Spinner/Spinner";

const TodaysMilkReport = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const todaysMilk = useSelector((state) => state.milkCollection.todaysMilk);
  const tmstatus = useSelector((state) => state.milkCollection.todaysMilk);

  useEffect(() => {
    dispatch(fetchTodaysMilk({ date: tDate }));
  }, [tDate]);

  // Filter and calculate data
  const morningData = todaysMilk?.filter((item) => item.ME === 0) || [];
  const eveningData = todaysMilk?.filter((item) => item.ME === 1) || [];

  const totalMorningLitres = morningData.reduce(
    (acc, item) => acc + item.Litres,
    0
  );
  const totalEveningLitres = eveningData.reduce(
    (acc, item) => acc + item.Litres,
    0
  );

  const morningCustomerCount = morningData.length;
  const eveningCustomerCount = eveningData.length;

  return (
    <>
      <div className="milk-collection-time-wise w100 h1 d-flex-col sb">
        <span className="heading">Milk Collection Details </span>
        <div className="time-wise-milk-collection w100 h1 d-flex sa p10">
          <div className="morning-milk-details-div w45 h1 d-flex-col sb">
            <div className="morning-milk-collection w100 h1 d-flex-col bg">
              <span className="label-text t-center py10">
                Morning Collection
              </span>
              <div className="details-info-div w100 h10 d-flex a-center sa bg1 p10">
                <span className="w10 f-info-text t-center">Code</span>
                <span className="w15 f-info-text t-end">FAT</span>
                <span className="w15 f-info-text t-end">SNF</span>
                <span className="w15 f-info-text t-end">Litre</span>
                <span className="w15 f-info-text t-end">Rate</span>
                <span className="w20 f-info-text t-end">Amount</span>
              </div>
              <div className="amt-info-details-div w100 h1 mh90 hidescrollbar d-flex-col">
                {tmstatus === "loading" ? (
                  <Spinner />
                ) : morningData.length > 0 ? (
                  morningData.map((milk, index) => (
                    <div
                      key={index}
                      className={`amt-info-div w100 h10 d-flex a-center sa ${
                        index % 2 === 0 ? "bg-light" : "bg-dark"
                      }`}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                      }}>
                      <span className="w10 text t-center">{milk.rno}</span>
                      <span className="w15 text t-end">{milk.fat}</span>
                      <span className="w15 text t-end">{milk.snf}</span>
                      <span className="w15 text t-end">{milk.Litres}</span>
                      <span className="w15 text t-end">{milk.rate}</span>
                      <span className="w20 text t-end">{milk.Amt}</span>
                    </div>
                  ))
                ) : (
                  <div className="w100 h1 d-flex center">
                    No customer found !
                  </div>
                )}
              </div>
            </div>
            <div className="total-details w100 d-flex sb">
              <span className="w50 label-text t-center">
                Customer : {morningCustomerCount}
              </span>
              <span className="w50 label-text t-center">
                Liters : {totalMorningLitres}
              </span>
            </div>
          </div>
          <div className="eveing-milk-details-div w45 h1 d-flex-col">
            <div className="evening-milk-collection w100 h1 d-flex-col bg">
              <span className="label-text t-center py10">
                Evening Collection
              </span>
              <div className="details-info-div w100 h10 d-flex a-center sa bg1 p10">
                <span className="w15  f-info-text t-center">FAT</span>
                <span className="w15  f-info-text t-center">SNF</span>
                <span className="w15  f-info-text t-center">Litre</span>
                <span className="w15  f-info-text t-center">Rate</span>
                <span className="w20  f-info-text t-center">Amount</span>
              </div>
              <div className="amt-info-details-div w100 h1 mh90 hidescrollbar d-flex-col">
                {tmstatus === "loading" ? (
                  <Spinner />
                ) : eveningData.length > 0 ? (
                  eveningData.map((milk, index) => (
                    <div
                      key={index}
                      className={`amt-info-div w100 h10 d-flex a-center sa ${
                        index % 2 === 0 ? "bg-light" : "bg-dark"
                      }`}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                      }}>
                      <span className="w15 text t-center">{milk.fat}</span>
                      <span className="w15 text t-center">{milk.snf}</span>
                      <span className="w15 text t-center">{milk.Litres}</span>
                      <span className="w15 text t-center">{milk.rate}</span>
                      <span className="w20 text t-center">{milk.Amt}</span>
                    </div>
                  ))
                ) : (
                  <div className="w100 h1 d-flex center">
                    No customer found !
                  </div>
                )}
              </div>
            </div>
            <div className="total-details w100 d-flex sb">
              <span className="w50 label-text t-center">
                Customer : {eveningCustomerCount}
              </span>
              <span className="w50 label-text t-center">
                Liters : {totalEveningLitres}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodaysMilkReport;
