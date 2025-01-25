import Home from "./Components/Home/Home";
import Mainapp from "./Components/Mainapp/Mainapp";
import Customers from "./Components/Customers/Customers";
import AdminPannel from "./Components/Adminpanel/AdminPannel";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setToDate,
  setFormDate,
} from "./App/Features/Customers/Date/dateSlice";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  requestForToken,
  onMessageListener,
} from "./Notifications/Notification";
import { saveFCMTokenToDB } from "./App/Features/Notifications/notificationSlice";
import UnauthPage from "./Components/Home/UnauthPage";

function App() {
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);
  const profile = useSelector((state) => state.profile.profileInfo);
  const [fcmToken, setFCMToken] = useState(null);

  useEffect(() => {
    dispatch(setToDate());
  }, [dispatch]);

  useEffect(() => {
    console.log("is token", fcmToken);
  }, []);

  useEffect(() => {
    if (toDate) {
      dispatch(setFormDate());
    }
  }, [dispatch, toDate]);

  // Firebase Messaging ....................

  // Foreground Firebase Messaging ..............
  onMessageListener()
    .then((payload) => {
      toast(
        <>
          <strong className="noti-title">{payload.notification.title}</strong>
          <p>{payload.notification.body}</p>
        </>,
        {
          autoClose: 3500,
        }
      );
    })
    .catch((err) => console.error("Error in onMessageListener:", err));

  

  // useEffect(() => {
  //   const fetchFCMToken = async () => {
  //     try {
  //       const token = await requestForToken();
  //       if (fcmToken === null && profile.srno !== undefined) {
  //         await dispatch(saveFCMTokenToDB({ token, cust_no: profile.srno }));
  //       }
  //     } catch (err) {
  //       console.error("User declined Notification permission!");
  //     }
  //   };
  //   fetchFCMToken();
  // }, [profile.srno]);

useEffect(() => {
  const fetchFCMToken = async () => {
    try {
      const token = await requestForToken();
      if (token) {
        setFCMToken(token);
        if (profile?.srno) {
          await dispatch(saveFCMTokenToDB({ token, cust_no: profile.srno }));
        }
      } else {
        console.warn("No FCM token returned!");
      }
    } catch (err) {
      console.error(
        err.message === "Notification not granted!"
          ? "User declined Notification permission!"
          : "Error fetching FCM token.",
        err
      );
    }
  };
  fetchFCMToken();
}, [profile?.srno]);

useEffect(() => {
  // When the customer list is updated, store it in localStorage
  if (!fcmToken) {
    localStorage.setItem("fcmtoken", JSON.stringify("yes"));
  }
}, [fcmToken]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route index path="/adminpanel" element={<AdminPannel />} />
          <Route index path="/mainapp/home" element={<Mainapp />} />
          <Route index path="/customer/dashboard" element={<Customers />} />
          <Route path="/unauthorized" element={<UnauthPage />} />
          {/* <Route path="*" element={<navigate to="/" />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose="1500"
        hideProgressBar="true"
        className={"react-tosts"}
      />
    </>
  );
}

export default App;
