import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPhone, FiMapPin, FiLayers, FiHash, FiUsers, FiMail, FiShield } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import toast from "react-hot-toast";

import ContactTable from "../components/ContactTable";
import { getOrganizationById } from "../api/organizationApi";
import { deleteContact, updateContact } from "../api/contactApi";
import EditContactModal from "../components/EditContactModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const data = await getOrganizationById(id);
      setOrganization(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch organization details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const handleEdit = (contactId) => {
    const contact = organization.contacts.find((c) => c.id === contactId);
    setSelectedContact(contact);
    setOpenEdit(true);
  };

  const handleUpdateContact = async (data) => {
    try {
      await updateContact(data.id, data);
      toast.success("Contact updated successfully!");
      fetchOrganization();
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update contact");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteContact(deleteId);
      toast.success("Contact deleted successfully!");
      setDeleteId(null);
      fetchOrganization();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
        <h3 className="text-xl font-bold text-brand-primary">Loading Details...</h3>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h3 className="text-xl font-bold text-gray-700">Organization not found</h3>
        <button 
          onClick={() => navigate("/organizations")}
          className="mt-4 text-brand-primary hover:underline flex items-center gap-2"
        >
          <FiArrowLeft /> Back to Organizations
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-8 mb-10">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/organizations")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-brand-primary">
          Organization Details
        </h1>
      </div>

      {/* Organization Info Card */}
      <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden border-t-4 border-t-brand-primary">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
          {/* Logo/Icon */}
          <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center text-brand-primary shrink-0 border border-blue-100 shadow-inner">
            <HiOutlineOfficeBuilding size={48} />
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {organization.name}
              </h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <FiMapPin className="text-brand-primary" />
                  <span>{organization.town || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <FiMapPin className="text-brand-primary" />
                  <span>{organization.local_authority || "N/A"}</span>
                </div>
              
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-6 border-t border-gray-100">

              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  URN
                </span>
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <FiHash size={14} className="text-brand-primary" />
                  {organization.urn || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Telephone
                </span>
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <FiPhone size={14} className="text-brand-primary" />
                  {organization.telephone || "N/A"}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Phase
                </span>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <FiLayers className="text-brand-primary" />
                  <span>{organization.phase || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Gender
                </span>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <FiUsers className="text-brand-primary" />
                    <span>{organization.gender || "Mixed"}</span>
                  </div>
              </div>
                  
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Address
                </span>
                <div className="text-sm text-gray-800 font-medium leading-relaxed">
                  {[
                    organization.street,
                    organization.address_line_1,
                    organization.postcode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-brand-primary flex items-center gap-2">
            <FiUsers /> Associated Contacts (
            {organization.contacts?.length || 0})
          </h3>
        </div>

        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          {organization.contacts && organization.contacts.length > 0 ? (
            <div className="p-6">
              <ContactTable
                data={organization.contacts.map((c) => ({
                  ...c,
                  organization_name: organization.name,
                  local_authority: organization.local_authority,
                }))}
                onEdit={handleEdit}
                onDelete={setDeleteId}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <FiUsers className="w-12 h-12 text-gray-300" />
              </div>
              <h4 className="text-lg font-bold text-gray-700">
                No Contacts Found
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                There are no contacts registered for this organization.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditContactModal
        open={openEdit}
        contact={selectedContact}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdateContact}
      />

      <ConfirmDeleteModal
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
