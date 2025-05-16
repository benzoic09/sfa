import React, { useState, useEffect } from 'react';

const EditOrganizationModal = ({ isOpen, onClose, onOrganizationUpdated, organization }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState(1);
  const [description, setDescription] = useState(''); // Add description state
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countriesError, setCountriesError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && organization) {
      setName(organization.name || '');
      setCode(organization.code || '');
      setCountry(organization.country || '');
      setStatus(organization.status !== undefined ? organization.status : 1);
      setDescription(organization.description || ''); // Initialize description
      setErrorMessage('');
      setSuccessMessage('');
      fetchCountries();
    } else if (isOpen) {
      fetchCountries();
    } else {
      setCountries([]);
      setLoadingCountries(true);
      setCountriesError('');
    }
  }, [isOpen, organization]);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    setCountriesError('');
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/countries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching countries:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.message || "Failed to fetch countries"
          }`
        );
      }
      const data = await response.json();
      setCountries(data.country || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountriesError("Failed to load countries.");
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleUpdate = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!name) {
      setErrorMessage('Organization Name is required.');
      setIsLoading(false);
      return;
    }
    if (!code) {
      setErrorMessage('Organization Code is required.');
      setIsLoading(false);
      return;
    }
    if (!country) {
      setErrorMessage('Country is required.');
      setIsLoading(false);
      return;
    }

    const updatedOrganization = {
      name: name,
      code: code,
      country: country,
      status: parseInt(status),
      description: description, // Include description in updatedOrganization
    };

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/organizations/${organization.id}`, // Use organization.id
        {
          method: 'PUT', // Use PUT method for updates
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedOrganization), // Send the updated data
        }
      );

      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        setSuccessMessage(data.message || "Organization updated successfully!");
        onOrganizationUpdated(updatedOrganization); // Pass updated data
        setTimeout(onClose, 1500);
      } else {
        // Handle server errors
        setErrorMessage(data.message || 'Failed to update organization.');
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      setErrorMessage('Failed to connect to the server.');
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
          <h3 className="text-lg font-semibold mb-4">Edit Organization</h3>
        </div>
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">
              Code:
            </label>
            <input
              type="text"
              id="code"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <input
              type="text"
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
              Country:
            </label>
            {loadingCountries ? (
              <div className="text-gray-500">Loading countries...</div>
            ) : countriesError ? (
              <div className="text-red-500">{countriesError}</div>
            ) : (
              <select
                id="country"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
              Status:
            </label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={status}
              onChange={(e) => setStatus(parseInt(e.target.value))}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
          <div className="col-span-4 mt-4 flex justify-end space-x-4">
          <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded min-w-[100px] focus:outline-none focus:shadow-outline"
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

export default EditOrganizationModal;
