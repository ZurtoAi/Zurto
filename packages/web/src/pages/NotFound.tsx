import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-heading">Page Not Found</h2>
          <p className="not-found-text">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Go Home
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
        <div className="not-found-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-square"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
