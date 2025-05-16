import React, { useState, useEffect } from "react";

const AddUserRoleModal = ({ isOpen, onClose, onRoleCreated }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("1"); // Default to Active
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear form data when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setRoleName("");
      setDescription("");
      setStatus("1");
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: roleName,
            description: description,
            status: parseInt(status),
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setSuccessMessage(data.message || "Role created successfully!");
        setRoleName(""); // Clear on success
        setDescription(""); // Clear on success
        setStatus("1"); // Reset status on success
        if (onRoleCreated && data.role) {
          onRoleCreated(data.role);
        }
        setTimeout(onClose, 1500);
      } else {
        setErrorMessage(data.message || "Failed to create role.");
      }
    } catch (error) {
      console.error("Error creating role:", error);
      setErrorMessage("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-center items-center border-b mb-4">
          <h3 className="text-lg font-semibold mb-4">New User Role</h3>
        </div>

        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mb-2">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="roleName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Role Name:
            </label>
            <input
              type="text"
              id="roleName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description (Optional):
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Status:
            </label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div className="col-span-4 mt-4 flex justify-end space-x-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Save"}
            </button>
            <button
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline mr-2"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserRoleModal;
