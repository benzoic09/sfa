import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../../layouts/MasterLayout";
import AddOrganizationModal from "./AddOrganizationModal";
import EditOrganizationModal from "./EditOrganizationModal";

const Organization = () => {
  const navigate = useNavigate();
  const userRoleName = localStorage.getItem("role");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [organizations, setOrganizations] = useState([]); // Initialize as an empty array
  const [isFetchingOrganizations, setIsFetchingOrganizations] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateError, setUpdateError] = useState("");

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (organization) => {
    setEditingOrganization(organization);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingOrganization(null);
    setIsEditModalOpen(false);
    setUpdateError("");
  };

  const fetchOrganizations = async () => {
    setIsFetchingOrganizations(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/organizations`,
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

      setOrganizations(data.rows);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      // Handle error appropriately
    } finally {
      setIsFetchingOrganizations(false);
    }
  };

  const handleOrganizationCreated = () => {
    closeAddModal();
    fetchOrganizations();
  };

  const handleOrganizationUpdated = (updatedOrganizationData) => {
    console.log("Updating organization:", updatedOrganizationData);
    closeEditModal();
    fetchOrganizations();
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.country.toLowerCase().includes(searchTerm.toLowerCase())
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
      fetchOrganizations();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <MasterLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Organizations</h2>
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
              disabled={isFetchingOrganizations}
            >
              Add Organization
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isFetchingOrganizations}
            >
              Export to Excel
            </button>
          </div>
          <input
            type="text"
            placeholder="Search organizations..."
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isFetchingOrganizations}
          />
        </div>

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Country</th>
                <th className="p-3 border text-center">Status</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingOrganizations ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    Loading organizations...
                  </td>
                </tr>
              ) : (
                filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{org.id}</td>
                    <td className="p-3 border">{org.code}</td>
                    <td className="p-3 border">{org.name}</td>
                    <td className="p-3 border">{org.description}</td>
                    <td className="p-3 border">{org.country}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          org.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {org.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 border">
                      {new Date(org.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openEditModal(org)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {filteredOrganizations.length === 0 &&
                !isFetchingOrganizations && (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-gray-500">
                      No organizations found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <AddOrganizationModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onOrganizationCreated={handleOrganizationCreated}
      />

      {editingOrganization && (
        <EditOrganizationModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          organization={editingOrganization}
          onOrganizationUpdated={handleOrganizationUpdated}
        />
      )}
    </MasterLayout>
  );
};

export default Organization;
