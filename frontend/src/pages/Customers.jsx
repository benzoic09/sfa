import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../layouts/MasterLayout";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";

const Customers = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateError, setUpdateError] = useState("");

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingCustomer(null);
    setIsEditModalOpen(false);
    setUpdateError("");
  };

  const fetchCustomers = async () => {
    setIsFetchingCustomer(true);
    try {
      const response = await fetch(`http://localhost:3000/api/clients`);
      /*http://localhost:3000/api/auth/register*/

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      //console.log("Full customers API response:", data);

      setCustomer(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsFetchingCustomer(false);
    }
  };

  const handleCustomerCreated = () => {
    closeAddModal();
    fetchCustomers();
  };

  const handleCustomerUpdated = (updatedCustomerData) => {
    console.log("Updating Customer Details:", updatedCustomerData);
    closeEditModal();
    fetchCustomers();
  };

  const filteredCustomer = customer.filter(
    (client) =>
      (client.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.branch || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.channel || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.subcategory || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.contactperson || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.location || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.relationship || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.customertype || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.banner || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.supplier || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.salesrep || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.salesrepcategroy || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.verificationstatus || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.verifiedby || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.verificationdate || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.routename || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.pricelist || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.longitude || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.latitude || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.firstsaledate || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.lastsaledate || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.lastsaleby || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.lastvisitby || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.lastvisitdate || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.createdby || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.datecreated || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (client.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchCustomers();
  });

  return (
    <MasterLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Customers</h2>
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
              disabled={isFetchingCustomer}
            >
              Add New Customer
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isFetchingCustomer}
            >
              Export to Excel
            </button>
          </div>
          <input
            type="text"
            placeholder="Search Customers..."
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isFetchingCustomer}
          />
        </div>

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Customer Name</th>
                <th className="p-3 border">Branch</th>
                <th className="p-3 border">Channel</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Sub-Category</th>
                <th className="p-3 border">Contact Person</th>
                <th className="p-3 border">Mobile</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">Relationship</th>
                <th className="p-3 border">Customer Type</th>
                <th className="p-3 border">Banner</th>
                <th className="p-3 border">Supplier</th>
                <th className="p-3 border">Sales Person</th>
                <th className="p-3 border">Sales Person Category</th>
                <th className="p-3 border">Verification Status</th>
                <th className="p-3 border">Verified By</th>
                <th className="p-3 border">Verification Date</th>
                <th className="p-3 border">Route Name</th>
                <th className="p-3 border">Pricelist</th>
                <th className="p-3 border">Latitude</th>
                <th className="p-3 border">Longitude</th>
                <th className="p-3 border">First Sale Date</th>
                <th className="p-3 border">Last Sale Date</th>
                <th className="p-3 border">Last Sale By</th>
                <th className="p-3 border">Last Visit By</th>
                <th className="p-3 border">Last Visit Date</th>
                <th className="p-3 border">Created By</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border text-center">Status</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingCustomer ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    Loading Customers...
                  </td>
                </tr>
              ) : (
                filteredCustomer.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{client.code}</td>
                    <td className="p-3 border">{client.name}</td>
                    <td className="p-3 border">{client.branch}</td>
                    <td className="p-3 border">{client.channel}</td>
                    <td className="p-3 border">{client.category}</td>
                    <td className="p-3 border">{client.subcategory}</td>
                    <td className="p-3 border">{client.contactperson}</td>
                    <td className="p-3 border">{client.mobile}</td>
                    <td className="p-3 border">{client.email}</td>
                    <td className="p-3 border">{client.location}</td>
                    <td className="p-3 border">{client.address}</td>
                    <td className="p-3 border">{client.relationship}</td>
                    <td className="p-3 border">{client.customertype}</td>
                    <td className="p-3 border">{client.banner}</td>
                    <td className="p-3 border">{client.supplier}</td>
                    <td className="p-3 border">{client.salesrep}</td>
                    <td className="p-3 border">{client.salesrepcategroy}</td>
                    <td className="p-3 border">{client.verificationstatus}</td>
                    <td className="p-3 border">{client.verifiedby}</td>
                    <td className="p-3 border">{client.verificationdate}</td>
                    <td className="p-3 border">{client.routename}</td>
                    <td className="p-3 border">{client.pricelist}</td>
                    <td className="p-3 border">{client.longitude}</td>
                    <td className="p-3 border">{client.latitude}</td>
                    <td className="p-3 border">{client.firstsaledate}</td>
                    <td className="p-3 border">{client.lastsaledate}</td>
                    <td className="p-3 border">{client.lastsaleby}</td>
                    <td className="p-3 border">{client.lastvisitby}</td>
                    <td className="p-3 border">{client.lastvisitdate}</td>
                    <td className="p-3 border">{client.createdby}</td>
                    <td className="p-3 border">{client.datecreated}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          client.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {client.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3 border text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openEditModal(client)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {filteredCustomer.length === 0 && !isFetchingCustomer && (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">
                    No Customers found ...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onCustomerCreated={handleCustomerCreated}
      />

      {editingCustomer && (
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          customer={editingCustomer}
          onCustomerUpdated={handleCustomerUpdated}
        />
      )}
    </MasterLayout>
  );
};

export default Customers;
