import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../../layouts/MasterLayout";
import AddUserRoleModal from "./AddUserRoleModal";
import EditUserRoleModal from "./EditUserRoleModal";

const UserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isFetchingRoles, setIsFetchingRoles] = useState(false);
  const [updateError, setUpdateError] = useState(""); // State to handle update errors
  const navigate = useNavigate();
  const userRoleName = localStorage.getItem("role");

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (role) => {
    if (role.name === "Administrator") {
      setUpdateError("The Administrator role cannot be edited.");
      setTimeout(() => setUpdateError(""), 3000); // Clear error after 3 seconds
      return;
    }
    setEditingRole(role);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingRole(null);
    setIsEditModalOpen(false);
    setUpdateError(""); // Clear any previous error when closing
  };

  const fetchRoles = async () => {
    setIsFetchingRoles(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const updatedRoles = data.userrole.map((role) => ({
        ...role,
        statusText: role.status === 1 ? "Active" : "Inactive",
      }));

      setRoles(updatedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      // Optionally set an error state for fetching
    } finally {
      setIsFetchingRoles(false);
    }
  };

  const handleRoleCreated = () => {
    closeAddModal();
    fetchRoles();
  };

  const handleRoleUpdated = (updatedRoleData) => {
    console.log("Updating role:", updatedRoleData);
    closeEditModal();
    fetchRoles();
  };

  useEffect(() => {
    const userRoleName = localStorage.getItem("role");

    if (userRoleName === "Administrator") {
      setIsAuthorized(true);
    } else {
      navigate("/unauthorized");
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      fetchRoles();
    }
  }, [isAuthorized]);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) return null;

  return (
    <MasterLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">User Roles</h2>
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
              disabled={isFetchingRoles}
            >
              Add Role
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isFetchingRoles}
            >
              Export to Excel
            </button>
          </div>
          <input
            type="text"
            placeholder="Search roles..."
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isFetchingRoles}
          />
        </div>

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Role Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border text-center ">Status</th>
                <th className="p-3 border text-center ">Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingRoles ? (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    Loading roles...
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{role.id}</td>
                    <td className="p-3 border">{role.name}</td>
                    <td className="p-3 border">{role.description}</td>
                    <td className="p-3 border text-center ">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          role.statusText === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {role.statusText}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      {role.name !== "Administrator" && (
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => openEditModal(role)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
              {filteredRoles.length === 0 && !isFetchingRoles && (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserRoleModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onRoleCreated={handleRoleCreated}
      />

      {editingRole && (
        <EditUserRoleModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          role={editingRole}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </MasterLayout>
  );
};

export default UserRoles;