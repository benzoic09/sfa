import React, { useState, useEffect } from "react";

const AddUserGroupModal = ({ isOpen, onClose, onUserGroupCreated }) => {
  const [name, setGroupName] = useState("");
  const [description, setDescrption] = useState("");
  const [target, setTarget] = useState("0");
  const [status, setStatus] = useState("1");
  const [callage, setCallage] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setGroupName("");
    setDescrption("");
    setTarget("0");
    setStatus("1");
    setCallage("0");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const formatNumber = (value) => {
    const number = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const parseNumber = (value) => {
    const parsed = parseFloat(value.toString().replace(/,/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleCreate = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!name.trim()) {
      setErrorMessage("User Group Name is required.");
      setIsLoading(false);
      return;
    }

    const newUserGroup = {
      name: name.trim(),
      description: description.trim(),
      target_value: parseNumber(target).toFixed(2),
      status: parseInt(status, 10),
      callage_target: parseNumber(callage).toFixed(2),
    };

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/usergroup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUserGroup),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.message || "Failed to create user group.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message || "User Group created successfully!");
      if (onUserGroupCreated && data.usergroup) {
        onUserGroupCreated(data.usergroup);
      }

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error creating user group:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-center items-center border-b mb-4">
          <h3 className="text-lg font-semibold mb-4">Add User Group</h3>
        </div>

        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mb-2">{successMessage}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Group Name:
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description:
            </label>
            <input
              type="text"
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescrption(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="target"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Target Value:
            </label>
            <input
              type="text"
              id="target"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={target}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                if (!isNaN(raw) || raw === "") {
                  setTarget(formatNumber(raw));
                }
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="callage"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Callage Target:
            </label>
            <input
              type="text"
              id="callage"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={callage}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                if (!isNaN(raw) || raw === "") {
                  setCallage(formatNumber(raw));
                }
              }}
              required
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
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Save"}
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline"
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

export default AddUserGroupModal;
