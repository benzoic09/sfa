import React, { useState, useEffect } from "react";

const AddUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [fullname, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState("1");

  // Dropdowns
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [userCategories, setUserCategories] = useState([]);
  const [selectedUserCategory, setSelectedUserCategory] = useState("");

  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");

  const [userGroups, setUserGroups] = useState([]);
  const [selectedUserGroup, setSelectedUserGroup] = useState("");

  const [userRoles, setUserRoles] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState("");

  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  const [pricelists, setPricelists] = useState([]);
  const [selectedPricelist, setSelectedPricelist] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (isOpen) {
      // Reset fields
      setFullName("");
      setEmail("");
      setUserName("");
      setMobile("");
      setStatus("1");
      setSelectedBranch("");
      setSelectedCountry("");
      setSelectedUserCategory("");
      setSelectedChannel("");
      setSelectedUserGroup("");
      setSelectedUserRole("");
      setSelectedSupervisor("");
      setSelectedPricelist("");
      setErrorMessage("");
      setSuccessMessage("");

      // Fetch dropdown data
      fetchDropdown("/admin/branch", (data) => setBranches(data.branch || []));
      fetchDropdown("/admin/countries", (data) => setCountries(data.country || []));
      fetchDropdown("/admin/usercategory", (data) => setUserCategories (data.usercategory || []));
      fetchDropdown("/admin/channels", (data) => setChannels(data.channel || []));
      fetchDropdown("/admin/usergroups", (data) => setUserGroups(data.usergroup || []));
      fetchDropdown("/admin/roles", (data) => setUserRoles(data.userrole || []));      
      fetchDropdown("/admin/supervisors",  (data) => setSupervisors(data.supervisor || []));
      fetchDropdown("/admin/pricelists", (data) => setPricelists(data.pricelistname || []));
    }
  }, [isOpen]);

  const fetchDropdown = async (url, setter) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(`Response from ${url}:`, data);
      const data = await res.json();
      //console.log(`Response from ${url}:`, data);
  
      if (res.ok) {
        setter(data || []);
        //setter(data && data.usergroup ? data.usergroup : (data || [])); // Adjust based on your actual response structure
   
      } else {
        console.error("Error fetching", url, data.message);
      }
    } catch (error) {
      console.error("Fetch failed for", url, error);
    }
  };
  

  const handleCreate = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    if (!fullname || !email || !mobile || !selectedBranch) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const newUser = {
      branch_id: selectedBranch,
      user_role_id: selectedUserRole,
      fullname,
      username,
      email,
      password,
      mobile,
      status: parseInt(status),      
      country_id: selectedCountry,
      user_category_id: selectedUserCategory,
      channel_id: selectedChannel,
      user_group_id: selectedUserGroup,      
      supervisor_id: selectedSupervisor ?? 0,
      //supervisor_id:selectedPricelist,
      pricelist_id: selectedPricelist,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("User created successfully!");
        onUserCreated && onUserCreated(data.user);
        setTimeout(onClose, 1000);
      } else {
        setErrorMessage(data.message || "Failed to create user.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderDropdown = (
    label,
    value,
    setter,
    options,
    id = "",
    required = true
  ) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <select
        id={id}
        className="shadow border rounded w-full py-2 px-3"
        value={value}
        onChange={(e) => setter(e.target.value)}
        required={required}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name || item.fullname}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      {/* <div className="bg-white p-6 rounded shadow-lg w-full max-w-md"> */}
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">

        <div className="flex justify-center items-center border-b mb-4">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              User Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mobile
            </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          {renderDropdown(
            "Branch",
            selectedBranch,
            setSelectedBranch,
            branches
          )}
          {renderDropdown(
            "Country",
            selectedCountry,
            setSelectedCountry,
            countries
          )}
          {renderDropdown(
            "User Category",
            selectedUserCategory,
            setSelectedUserCategory,
            userCategories
          )}
          {renderDropdown(
            "Channel",
            selectedChannel,
            setSelectedChannel,
            channels
          )}
          {renderDropdown(
            "User Group",
            selectedUserGroup,
            setSelectedUserGroup,
            userGroups
          )}
          {renderDropdown(
            "User Role",
            selectedUserRole,
            setSelectedUserRole,
            userRoles
          )}
          {renderDropdown(
            "Supervisor",
            selectedSupervisor,
            setSelectedSupervisor,
            supervisors,
            "",
            false
          )}
          {renderDropdown(
            "Pricelist",
            selectedPricelist,
            setSelectedPricelist,
            pricelists
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline mr-2"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
