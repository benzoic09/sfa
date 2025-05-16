import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../../layouts/MasterLayout";
import AddBranchModal from "./AddBranchModal";
import EditBranchModal from "./EditBranchModal";

const Branch = () => {
  const navigate = useNavigate();
  const userRoleName = localStorage.getItem("role");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [branch, setBranch] = useState([]);
  const [isFetchingBranch, setIsFetchingBranch] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateError, setUpdateError] = useState("");

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingBranch(null);
    setIsEditModalOpen(false);
    setUpdateError("");
  };

  const fetchBranch = async () => {
    setIsFetchingBranch(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/branch`,
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

      setBranch(data.branch || []);
    } catch (error) {
      console.error("Error fetching branch:", error);
      // Handle error appropriately
    } finally {
      setIsFetchingBranch(false);
    }
  };

  const handleBranchCreated = () => {
    closeAddModal();
    fetchBranch();
  };

  const handleBranchUpdated = (updatedOBranchData) => {
    console.log("Updating Branch:", updatedOBranchData);
    closeEditModal();
    fetchBranch();
  };

  const filteredBranch = branch.filter(
    (brch) =>
      brch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brch.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brch.country.toLowerCase().includes(searchTerm.toLowerCase())
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
      fetchBranch();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <MasterLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Branches</h2>
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
              disabled={isFetchingBranch}
            >
              Add Branch
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isFetchingBranch}
            >
              Export to Excel
            </button>
          </div>
          <input
            type="text"
            placeholder="Search Branch..."
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isFetchingBranch}
          />
        </div>

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Name</th>   
                <th className="p-3 border">Company</th>             
                <th className="p-3 border">Country</th>
                <th className="p-3 border text-center">Status</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingBranch ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    Loading branches...
                  </td>
                </tr>
              ) : (
                filteredBranch.map((brch) => (
                  <tr key={brch.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{brch.id}</td>
                    <td className="p-3 border">{brch.code}</td>
                    <td className="p-3 border">{brch.name}</td>                    
                    <td className="p-3 border">{brch.company}</td>
                    <td className="p-3 border">{brch.country}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                            brch.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {brch.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 border">
                      {new Date(brch.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openEditModal(brch)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {filteredBranch.length === 0 &&
                !isFetchingBranch && (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-gray-500">
                      No Branch found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <AddBranchModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onBranchCreated={handleBranchCreated}
      />

      {editingBranch && (
        <EditBranchModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          branch={editingBranch}
          onBranchUpdated={handleBranchUpdated}
        />
      )}
    </MasterLayout>
  );


};

export default Branch;
