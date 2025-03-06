import React from "react";

const Player = ({ x, y, color }) => {
  return (
    <div
      className="player"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    ></div>
  );
};

export default Player;
