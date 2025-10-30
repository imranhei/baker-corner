import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/redux/auth-slice";
import { LoaderCircle } from "lucide-react";

const CheckAuth = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoadingAuth, authChecked } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkAuth());
    }
  }, [authChecked, dispatch]);

  // ⏳ Still checking, don't render or redirect yet
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  // 🔐 Not authenticated after checking
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: pathname }} />;
  }

  return <>{children}</>;
};

export default CheckAuth;