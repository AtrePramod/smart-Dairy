import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import Forms from "./Forms/Forms";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import "../../Styles/Home/Home.css";
import FlashScreen from "./FlashScreen";

const Home = () => {
  const [showFlashScreen, setShowFlashScreen] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Timer for flash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlashScreen(false);
    }, 1200); // Flash screen stays for 1.2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isOnline) {
    return (
      <div className="nointernet-screen w100 h100 d-flex-col center bg1">
        <span className="first-text">
          <MdSignalWifiConnectedNoInternet0 />
        </span>
        <span className="second-text">No Internet Connection</span>
        <span className="p-text">
          Please check your internet settings and try again.
        </span>
      </div>
    );
  }

  return (
    <>
      {showFlashScreen ? (
        <div className="w100 h1 d-flex-col center">
          <FlashScreen />
        </div>
      ) : (
        <>
          <div className="nav-bar w100 ">
            <Navigation />
          </div>
          <div className="home-container w100  d-flex center">
            <div className="img-info-container w50 h1 d-flex-col">
              <div className="img-container box"></div>
            </div>
            <div className="login-register-container w50 h1 d-flex center">
              <Forms />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
