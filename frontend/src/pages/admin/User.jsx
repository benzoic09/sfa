import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../../layouts/MasterLayout";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

const User = () => {
  const navigate = useNavigate();
  const userRoleName = localStorage.getItem("role");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState([]);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateError, setUpdateError] = useState("");

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
    setUpdateError("");
  };

  const fetchUser = async () => {
    setIsFetchingUser(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        //`${import.meta.env.VITE_API_URL}/admin/branch`,
        `${import.meta.env.VITE_API_URL}/admin/user`,
        //branch
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      //console.log("Full user API response:", data);

      setUser(data || []);
    } catch (error) {
      console.error("Error fetching user:", error);
      // Handle error appropriately
    } finally {
      setIsFetchingUser(false);
    }
  };

  const handleUserCreated = () => {
    closeAddModal();
    fetchUser();
  };

  const handleUserUpdated = (updatedUserData) => {
    console.log("Updating Branch:", updatedUserData);
    closeEditModal();
    fetchUser();
  };

  const filteredUser = user.filter(
    (usr) =>
      (usr.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.branch || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.usercategory || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.channel || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.usergroup || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.userrole || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.supervisor || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.pricelistname || "").toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  useEffect(() => {
    if (userRoleName === "Administrator") {
      setIsAuthorized(true);
    } else {
      navigate("/unauthorized");
    }
  }, [navigate, userRoleName]);

  useEffect(() => {
    if (isAuthorized) {
      fetchUser();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <MasterLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Users</h2>
        </div>

        {updateError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {updateError}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={openAddModal}
              disabled={isFetchingUser}
            >
              Add New User
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isFetchingUser}
            >
              Export to Excel
            </button>
          </div>
          <input
            type="text"
            placeholder="Search Users..."
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isFetchingUser}
          />
        </div>

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Full Names</th>
                <th className="p-3 border">Email</th>   
                <th className="p-3 border">Mobile</th>             
                <th className="p-3 border">Branch</th>                
                <th className="p-3 border">Country</th>
                <th className="p-3 border">User Category</th>
                <th className="p-3 border">Channel</th>
                <th className="p-3 border">User Group</th>
                <th className="p-3 border">Role Group</th>
                <th className="p-3 border">Supervisor</th>
                <th className="p-3 border">Price List</th>
                <th className="p-3 border text-center">Status</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingUser ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : (
                filteredUser.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{usr.id}</td>
                    <td className="p-3 border">{usr.fullname}</td>
                    <td className="p-3 border">{usr.email}</td>                    
                    <td className="p-3 border">{usr.mobile}</td>
                    <td className="p-3 border">{usr.branch}</td>                                     
                    <td className="p-3 border">{usr.country}</td>
                    <td className="p-3 border">{usr.usercategory}</td>
                    <td className="p-3 border">{usr.channel}</td>
                    <td className="p-3 border">{usr.usergroup}</td>
                    <td className="p-3 border">{usr.userrole}</td>
                    <td className="p-3 border">{usr.supervisor}</td>
                    <td className="p-3 border">{usr.pricelistname}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                            usr.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {usr.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 border">
                      {new Date(usr.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openEditModal(usr)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {filteredUser.length === 0 &&
                !isFetchingUser && (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-gray-500">
                      No Users found ...
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onUserCreated={handleUserCreated}
      />

      {editingUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          user={editingUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </MasterLayout>
  );


};

export default User;
