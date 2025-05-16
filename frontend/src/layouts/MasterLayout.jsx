import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MasterLayout = ({ children }) => {
    const [configurationsDropdown, setConfigurationsDropdown] = useState(false);
    const [customerDropdown, setCustomerDropdown] = useState(false);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [inventoryDropdown, setInventoryDropdown] = useState(false);
    const [settingsDropdown, setSettingsDropdown] = useState(false);
    const [usernameDropdown, setUsernameDropdown] = useState(false);
    const [username, setUsername] = useState("");
    const [userManagementDropdown, setUserManagementDropdown] = useState(false); 
    const [companySetupDropdown, setCompanySetupDropdown] = useState(false); 
  
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        //get current user name
        const storedUsername = localStorage.getItem("username") || "Guest";        
        if (storedUsername) {
          setUsername(storedUsername);
        }
    
        const handleClickOutside = (event) => {
          if (!event.target.closest(".dropdown-menu")) {
            setConfigurationsDropdown(false);
            setCustomerDropdown(false);
            setInventoryDropdown(false);
            setSettingsDropdown(false);
            setUsernameDropdown(false);
            setUserManagementDropdown(false);
            setCompanySetupDropdown(false);
          }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }, [location.pathname]);
    
      // Logout function
      const handleLogout = () => {
        localStorage.removeItem("token"); // Remove JWT token from local storage
        localStorage.removeItem("username"); // Remove the username from local storage
        localStorage.clear(); 
        navigate("/login"); // Redirect to login page
      };
    

    return (
        <div className="min-h-screen flex flex-col relative ">
          {/* Top Navbar */}
          <nav className="bg-gradient-to-br from-blue-800 to-blue-100 bg-opacity-90 text-white p-3 flex justify-between items-center">
            <div className="flex items-center h-10 mr-3">
              
            </div>
            
            <div className="flex items-center gap-4 relative dropdown-menu">
              <div className="relative dropdown-menu">
                <span
                  className="cursor-pointer flex items-center gap-2 text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUsernameDropdown(!usernameDropdown);
                  }}
                >
                  👤 {username}
                </span>
                {usernameDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-md w-40 z-50">
                    <ul className="text-black">
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          navigate("/");
                          setUsernameDropdown(false);
                        }}
                      >
                        My Profile
                      </li>
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setUsernameDropdown(false);
                          handleLogout();
                        }}
                      >
                        Log out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </nav>
    
          {/* Bottom Menu Bar */}
          <div className="bg-white shadow-md py-2 px-4 flex justify-between items-center relative z-10">
            <div className="flex gap-8">
              {/* Configurations Menu with Dropdown */}
              <div className="relative dropdown-menu">
                <button
                  className="flex items-center cursor-pointer gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfigurationsDropdown(!configurationsDropdown);
                    setCustomerDropdown(false);
                    setInventoryDropdown(false);
                    setSettingsDropdown(false);
                  }}
                >
                  <span className="text-xl">👥</span>
                  <span className="text-sm">Configurations</span>
                </button>
                {configurationsDropdown && (
                 <div className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-40 z-50">
                    <ul className="text-black">
                    <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => setUserManagementDropdown(!userManagementDropdown)}
                      >
                        User Management
                      </li>
                      {userManagementDropdown && (
                        <div className="ml-4">
                          <ul className="text-black">
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/admin-user")}>Users</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/admin/user-group")}>User Groups</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/admin/user-role")}>User Roles</li>
                          </ul>
                        </div>
                      )}
                       <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => setCompanySetupDropdown(!companySetupDropdown)}>Company Setup</li>
                      {companySetupDropdown && (
                        <div className="ml-4">
                          <ul className="text-black">
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/admin/organization")}>Organisation</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/admin/branch")}>Branch</li>
                          </ul>
                        </div>
                      )}
                      <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => setCompanySetupDropdown(!companySetupDropdown)}>Route Management</li>
                       <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => setCompanySetupDropdown(!companySetupDropdown)}>Price Management</li>
                    </ul>
                  </div>
                )}
              </div>
    
              {/* Customers Menu with Dropdown */}
              <div className="relative dropdown-menu">
                <button
                  className="flex items-center cursor-pointer gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomerDropdown(!customerDropdown);
                    setInventoryDropdown(false);
                    setSettingsDropdown(false);
                    setConfigurationsDropdown(false);
                  }}
                >
                  <span className="text-xl">👥</span>
                  <span className="text-sm">Customers</span>
                </button>
                {customerDropdown && (
                  <div className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-40 z-50">
                    <ul className="text-black">
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          navigate("/customers");
                          setCustomerDropdown(false);
                        }}
                      >
                        Customer Master
                      </li>
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => setCustomerDropdown(false)}
                      >
                        Customer Reports
                      </li>
                    </ul>
                  </div>
                )}
              </div>
    
              {/* Inventory Menu with Dropdown */}
              <div className="relative dropdown-menu">
                <button
                  className="flex items-center cursor-pointer gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInventoryDropdown(!inventoryDropdown);
                    setCustomerDropdown(false);
                    setSettingsDropdown(false);
                  }}
                >
                  <span className="text-xl">📦</span>
                  <span className="text-sm">Inventory</span>
                </button>
                {inventoryDropdown && (
                  <div className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-40 z-50">
                    <ul className="text-black">
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate("/products")}
                      >
                        Product Master
                      </li>
                      <li className="p-2 hover:bg-gray-200 cursor-pointer">
                        Product Category
                      </li>
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate("/principles")}
                      >
                        Principles Master
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
    
          <main className="flex-grow p-6">{children}</main>
    
          {/* <AddCustomerModal
            isOpen={isAddCustomerOpen}
            onClose={() => setIsAddCustomerOpen(false)}
          /> */}
        </div>
      );
}
export default MasterLayout;