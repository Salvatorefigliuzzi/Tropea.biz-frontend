import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/store";
import { Spinner } from "react-bootstrap";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Mostra spinner mentre carica il profilo utente per evitare redirect errati
  if (loading && !user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
