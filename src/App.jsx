import { useSelector } from "react-redux";
import DevToolsBlocker from "./components/common/DevToolsBlocker";
import SessionTimeoutTracker from "./components/SessionTimeoutTracker/SessionTimeoutTracker";
import { Toaster } from "./components/ui/toaster";
import useLogout from "./hooks/useLogout";
import AppRoutes from "./routes/AppRoutes";
import VersionCheck from "./utils/VersionCheck";
import { useLocation } from "react-router-dom";
import DisabledRightClick from "./components/common/DisabledRightClick";

function App() {
  const time = useSelector((state) => state.auth.token_expire_time);
  const handleLogout = useLogout();
  const location = useLocation();
  console.log(location?.pathname);
  return (
    <>
      <DevToolsBlocker />
      <DisabledRightClick />
      <VersionCheck />
      <Toaster />
      <SessionTimeoutTracker expiryTime={time} onLogout={handleLogout} />
      <AppRoutes />
    </>
  );
}

export default App;
