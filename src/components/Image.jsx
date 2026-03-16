import React from "react";

const Image = ({ src, alt, className, ...props }) => {
  return (
    <img
      src={src || "/avatar.png"}
      alt={alt || "image"}
      className={className}
      loading="lazy"
      {...props}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/avatar.png";
      }}
    />
  );
};

export default Image;