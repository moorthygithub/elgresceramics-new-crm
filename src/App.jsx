import { Route, Routes, useNavigate } from "react-router-dom";

import { Toaster } from "./components/ui/toaster";

import SessionTimeoutTracker from "./components/SessionTimeoutTracker/SessionTimeoutTracker";
import DisabledRightClick from "./components/common/DisabledRightClick";

import AppRoutes from "./routes/AppRoutes";
import VersionCheck from "./utils/VersionCheck";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const time = localStorage.getItem("token-expire-time");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* <DisabledRightClick /> */}
      {/* <VersionCheck
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      /> */}
      <Toaster />
      <SessionTimeoutTracker expiryTime={time} onLogout={handleLogout} />
      <AppRoutes />
    </>
  );
}

export default App;
