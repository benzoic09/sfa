
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserRoles from "./pages/admin/UserRoles";
import Organization from "./pages/admin/Organization";
import Branch from "./pages/admin/Branch";
import UserGroup from "./pages/admin/UserGroups";
import User from "./pages/admin/User";
import Customers from "./pages/Customers";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>   
        <Route path="/customers" element={<Customers />}></Route>   
        <Route path="/admin-user" element={<User />}></Route>     
        <Route path="/admin/user-role" element={<UserRoles />} />
        <Route path="/admin/user-group" element={<UserGroup />} />
        <Route path="/admin/organization" element={<Organization />} />
        <Route path="/admin/branch" element={<Branch />} />
      </Routes>
    </Router>
  );
}

export default App;
