import React from "react";

const AuthWrapper = ({ auth, children }) => {
  return (
    <>
      {auth === true ? (
        <>{children}</>
      ) : (
        <>
          <span className="block text-center">Loading...</span>
        </>
      )}
    </>
  );
};

export default AuthWrapper;

