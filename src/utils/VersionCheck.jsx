import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import BASE_URL from "@/config/BaseUrl";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VersionCheck = ({ isDialogOpen, setIsDialogOpen }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [retryPopup, setRetryPopup] = useState(false);
  const [serverVersion, setServerVersion] = useState(null);
  //   const [isDialogOpen, setIsDialogOpen] = useState(false);

  const localVersion = localStorage.getItem("version");

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const statusRes = await axios.get(`${BASE_URL}/api/panelCheck`);
        const serverVer = statusRes?.data?.version?.version_panel;

        setServerVersion(serverVer);
        if (token && statusRes.data?.msg == "success") {
          localStorage.setItem("serverversion", serverVer);

          if (localVersion !== serverVer) {
            setIsDialogOpen(true);
          } else {
            localStorage.setItem("version", serverVer);
          }
        }
      } catch (error) {
        console.error("Panel status check failed:", error);
      }
    };

    checkVersion();
  }, [token, navigate]);

  useEffect(() => {
    if (retryPopup) {
      const timeout = setTimeout(() => {
        setIsDialogOpen(true);
        setRetryPopup(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [retryPopup]);

  if (!token) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent
        className="max-w-md p-6 rounded-2xl shadow-2xl border bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 [&>button.absolute]:hidden"
        aria-describedby={undefined}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideClose={true}
      >
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-3">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Update Available
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            A new version of the panel is ready. Update now to version{" "}
            <span className="font-medium text-blue-600">{serverVersion}</span>.
          </p>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              handleCloseDialog();
              setRetryPopup(true);
            }}
            className="rounded-full px-6 py-2"
          >
            Do It Later
          </Button>
          <Button
            onClick={handleLogout}
            className="rounded-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Updating" : "Update Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionCheck;
