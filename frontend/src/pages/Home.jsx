import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MasterLayout from "../layouts/MasterLayout";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    //check if the user is authenticated
    const isAuthenticated = localStorage.getItem("authToken");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <MasterLayout>
      <div className="flex">
        <div className="p-7">
          <h1 className="text-2xl font-semibold">Home Page</h1>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Home;
