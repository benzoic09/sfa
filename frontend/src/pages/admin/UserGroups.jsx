import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../../layouts/MasterLayout";
import AddUserGroupModal from "./AddUserGroup";
import EditUserGroupModal from "./EditUserGroup";

const UserGroup = () => {
  const navigate = useNavigate();
  const userRoleName = localStorage.getItem("role");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userGroup, setUserGroup] = useState([]);
  const [isFetchingUsergroup, setIsFetchingUserGroup] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserGroup, setEditingUserGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateError, setUpdateError] = useState("");

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (userGroup) => {
    setEditingUserGroup(userGroup);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUserGroup(null);
    setIsEditModalOpen(false);
    setUpdateError("");
  };

  const fetchUserGroup = async () => {
    setIsFetchingUserGroup(true);
    const token = localStorage.getItem("authToken");
    const url = `${import.meta.env.VITE_API_URL}/admin/usergroups`;
    try {
      //console.log("Fetching user groups from:", url);
      const response = await fetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      //console.log("Response data:", data);

      // Check if data.rows exists and is an array before setting the state
      if (data.usergroup && Array.isArray(data.usergroup)) {
        setUserGroup(data.usergroup);
      } else {
        // Handle the case where there's no data, e.g., set an empty array
        setUserGroup([]);
        setUpdateError("No user groups found."); // set updateError
      }
    } catch (error) {
      console.error("Error fetching usergroups:", error);
      setUpdateError(error.message || "Failed to fetch user groups");
    } finally {
      setIsFetchingUserGroup(false);
    }
  };

  const handleUserGroupCreated = () => {
    closeAddModal();
    fetchUserGroup();
  };

  const handleUserGroupUpdated = (updatedUserGroupData) => {
    console.log("Updating user group:", updatedUserGroupData);
    closeEditModal();
    fetchUserGroup();
  };

  const filteredUserGroup = userGroup.filter(
    (usrgrp) =>
      usrgrp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usrgrp.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      fetchUserGroup();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <MasterLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">User Groups</h2>
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
              disabled={isFetchingUsergroup}
            >
              Add User Group
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isFetchingUsergroup}
            >
              Export to Excel
            </button>
          </div>
          <input
            type="text"
            placeholder="Search user groups..."
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isFetchingUsergroup}
          />
        </div>

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Group Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Target Value</th>
                <th className="p-3 border">Callage Target</th>
                <th className="p-3 border text-center">Status</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingUsergroup ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    Loading user groups...
                  </td>
                </tr>
              ) : (
                filteredUserGroup.map((usrgrp) => (
                  <tr key={usrgrp.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{usrgrp.id}</td>
                    <td className="p-3 border">{usrgrp.name}</td>
                    <td className="p-3 border">{usrgrp.description}</td>
                    <td className="p-3 border">{usrgrp.target_value}</td>
                    <td className="p-3 border">{usrgrp.callage_target}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${usrgrp.status === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {usrgrp.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openEditModal(usrgrp)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {filteredUserGroup.length === 0 &&
                !isFetchingUsergroup && (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-gray-500">
                      No user groups found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserGroupModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onUserGroupCreated={handleUserGroupCreated}
      />

      {editingUserGroup && (
        <EditUserGroupModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          userGroup={editingUserGroup}
          onUserGroupUpdated={handleUserGroupUpdated}
        />
      )}
    </MasterLayout>
  );
};

export default UserGroup;

