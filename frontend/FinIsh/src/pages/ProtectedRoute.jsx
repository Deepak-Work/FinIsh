import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthOptions } from "../authentication/AuthOptions";

const ProtectedRoute = (props) => {
    const { user } = useContext(AuthOptions);
    const { children } = props;
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;