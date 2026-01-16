import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {
    const user = localStorage.getItem("authUser");

  return user ? <Navigate to="/" /> : <Outlet/>;
};

export default PublicRoutes
