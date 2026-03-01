import React from "react";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-box">
        <h2>Portfolio is loading...</h2>
        <p>Please wait while the server wakes up ☕</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  box: {
    textAlign: "center",
  },
  spinner: {
    marginTop: "20px",
    width: "40px",
    height: "40px",
    border: "4px solid #fff",
    borderTop: "4px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};