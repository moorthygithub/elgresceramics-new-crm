import React from "react";
import image from "../assets/logo.png";
import image1 from "../assets/el.png";

const Logo = ({ showLogo }) => {
  return (
    <>
      {showLogo === "true" ? (
        <img src={image1} alt="logo" className="h-8 w-full" />
      ) : (
        <img src={image} alt="logo" className="w-[200px] mx-auto" />
      )}
    </>
  );
};

export default Logo;
