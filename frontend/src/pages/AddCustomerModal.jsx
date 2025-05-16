import React, { useState, useEffect } from "react";
const AddCustomerModal = ({ isOpen, onClose, onCustomerCreated }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [contactperson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [banner, setBanner] = useState("");
  const [supplier, setSupplier] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [status, setStatus] = useState("1");

  // Dropdowns
  const [branch, setBranch] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [channel, setChannel] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");

  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [subcategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [relationship, setRelationship] = useState([]);
  const [selectedRelationship, setSelectedRelationship] = useState("");

  const [customertype, setCustomerType] = useState([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState("");

  const [salesrep, setSalesRep] = useState([]);
  const [selectedSalesRep, setSelectedSalesRep] = useState("");

  //THINK HOW YOU WILL SAVE CURRENT SALES REP CATEGORY

  const [routename, setRouteName] = useState([]);
  const [selectedRouteName, setSelectedRouteName] = useState("");

  const [pricelist, setPricelist] = useState([]);
  const [selectedPricelist, setSelectedPricelist] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setName("");
      setContactPerson("");
      setMobile("");
      setEmail("");
      setAddress("");
      setBanner("");
      setSupplier("");
      setLongitude("");
      setLatitude("");
      setStatus("1");

      selectedBranch("");
      selectedChannel("");
      selectedCategory("");
      selectedSubCategory("");
      selectedLocation("");
      selectedRelationship("");
      selectedCustomerType("");
      selectedSalesRep("");
      selectedRouteName("");
      selectedPricelist("");

      // Fetch dropdown data
      fetchDropdown("/admin/customer_branch", (data) =>
        setBranch(data.branch || [])
      );
      fetchDropdown("/admin/customer_channel", (data) =>
        setChannel(data.country || [])
      );
      fetchDropdown("/admin/customer_category", (data) =>
        setCategory(data.usercategory || [])
      );
      fetchDropdown("/admin/customer_subcategory", (data) =>
        setSubCategory(data.channel || [])
      );
      fetchDropdown("/admin/customer_location", (data) =>
        setLocation(data.usergroup || [])
      );
      fetchDropdown("/admin/customer_relationship", (data) =>
        setRelationship(data.userrole || [])
      );
      fetchDropdown("/admin/customer_customertype", (data) =>
        setCustomerType(data.supervisor || [])
      );
      fetchDropdown("/admin/customer_salesrep", (data) =>
        setSalesRep(data.pricelistname || [])
      );
      fetchDropdown("/admin/customer_routename", (data) =>
        setRouteName(data.pricelistname || [])
      );
      fetchDropdown("/admin/customer_pricelist", (data) =>
        setPricelist(data.pricelistname || [])
      );
    }
  }, [isOpen]);

  const fetchDropdown = async (url, setter) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`);
      //console.log(`Response from ${url}:`, data);
      const data = await res.json();
      console.log(`Response from ${url}:`, data);

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

    if (
      !fullname ||
      !email ||
      !mobile ||
      !selectedBranch ||
      !selectedChannel ||
      !selectedCategory ||
      !selectedLocation ||
      !selectedPricelist ||
      !selectedCustomerType ||
      !selectedRelationship
    ) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const newCustomer = {
      code,
      name,
      contactperson,
      mobile,
      email,
      address,
      banner,
      supplier,
      longitude,
      latitude,
      branch: selectedBranch,
      channel: selectedChannel,
      category: selectedCategory,
      location: selectedLocation,
      relationship: selectedRelationship,
      customertype: selectedCustomerType,
      salesrep: selectedSalesRep,
      routename: selectedRouteName,
      pricelist: selectedPricelist,
      status: parseInt(status),   
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Customer created successfully!");
        onCustomerCreated && onCustomerCreated(data.customer);
        setTimeout(onClose, 1000);
      } else {
        setErrorMessage(data.message || "Failed to create customer.");
      }
    } catch (err) {
      setErrorMessage(
        "An unexpected error occurred, while saving customer details."
      );
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
          <h3 className="text-lg font-semibold mb-4">Add New Customer</h3>
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
              Customer Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contact Person
            </label>
            <input
              type="text"
              value={contactperson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mobile No.
            </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
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
              Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Banner
            </label>
            <input
              type="text"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              className="shadow border rounded w-full py-2 px-3"
            />
          </div>

          {renderDropdown("Branch", selectedBranch, setSelectedBranch, branch)}
          {renderDropdown(
            "Customer Channel",
            selectedChannel,
            setSelectedChannel,
            channel
          )}
          {renderDropdown(
            "Customer Category",
            selectedCategory,
            setSelectedCategory,
            category
          )}
          {renderDropdown(
            "Customer Sub-Category",
            selectedSubCategory,
            setSelectedSubCategory,
            subcategory
          )}
          {renderDropdown(
            "Location",
            selectedLocation,
            setSelectedLocation,
            location
          )}
          {renderDropdown(
            "Customer Relationship",
            selectedRelationship,
            setSelectedRelationship,
            relationship
          )}
          {renderDropdown(
            "Customer Type",
            selectedCustomerType,
            setSelectedCustomerType,
            customertype
          )}
          {renderDropdown(
            "Sales Person",
            selectedSalesRep,
            setSelectedSalesRep,
            salesrep
          )}
          {renderDropdown(
            "Route Name",
            selectedRouteName,
            setSelectedRouteName,
            routename
          )}
          {renderDropdown(
            "Pricelist",
            selectedPricelist,
            setSelectedPricelist,
            pricelist
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
export default AddCustomerModal;
