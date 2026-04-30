import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FiArrowLeft, FiMail, FiPhone, FiBriefcase, FiMapPin, 
  FiCalendar, FiUser, FiInfo, FiActivity, FiEdit3, FiTrash2
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import toast from "react-hot-toast";

import { getContactById, deleteContact, updateContact } from "../api/contactApi";
import { getOrganizationById } from "../api/organizationApi";
import EditContactModal from "../components/EditContactModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [contact, setContact] = useState(location.state?.contact || null);
  const [loading, setLoading] = useState(!location.state?.contact);

  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchContact = async () => {
    try {
      if (!contact) setLoading(true);
      const data = await getContactById(id);
      
      // If we got the contact but it's missing organization details, 
      // and we have an organization ID, try to fetch the organization
      if (data && !data.organization?.name && (data.organization || data.organization_id)) {
        const orgId = typeof data.organization === 'string' ? data.organization : (data.organization?.id || data.organization_id);
        try {
          const orgData = await getOrganizationById(orgId);
          data.organization = orgData;
        } catch (orgErr) {
          console.error("Failed to fetch organization for contact:", orgErr);
        }
      }

      setContact(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (!contact) toast.error("Failed to fetch contact details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  const handleUpdateContact = async (data) => {
    try {
      await updateContact(data.id, data);
      toast.success("Contact updated successfully!");
      fetchContact();
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update contact");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteContact(id);
      toast.success("Contact deleted successfully!");
      setDeleteId(null);
      navigate("/contact");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
        <h3 className="text-xl font-bold text-brand-primary">Loading Contact Profile...</h3>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h3 className="text-xl font-bold text-gray-700">Contact not found</h3>
        <button 
          onClick={() => navigate("/contact")}
          className="mt-4 text-brand-primary hover:underline flex items-center gap-2"
        >
          <FiArrowLeft /> Back to Contacts
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto space-y-6 pb-12">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/contact")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-brand-primary hover:border-blue-200 transition-all shadow-sm"
        >
          <FiArrowLeft size={16} /> Contacts List
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-500 font-medium">{contact.contact_person}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Profile Header Card */}
          <div className="bg-white rounded-3xl border border-blue-50 shadow-sm overflow-hidden border-t-4 border-t-brand-primary">
            <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-500/20 shrink-0">
                {contact.contact_person?.charAt(0)}
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-black text-gray-900">{contact.contact_person}</h1>
                  <p className="text-brand-primary font-bold text-lg flex items-center gap-2">
                    <FiBriefcase /> {contact.job_title || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professional Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiInfo className="text-brand-primary" /> Professional Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Organization</p>
                  <button 
                    onClick={() => (contact.organization?.id || contact.organization_id) && navigate(`/organizations/${contact.organization?.id || contact.organization_id}`)}
                    className="flex items-center gap-2 text-gray-800 font-bold hover:text-brand-primary transition-colors text-left"
                  >
                    <HiOutlineOfficeBuilding className="text-brand-primary" size={18} />
                    {contact.organization?.name || contact.organization_name || "N/A"}
                  </button>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Job Title</p>
                  <p className="text-sm font-bold text-gray-700">{contact.job_title || "N/A"}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Local Authority</p>
                  <p className="text-sm font-bold text-gray-700">{contact.local_authority || contact.organization?.local_authority || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiMapPin className="text-brand-primary" /> Location & Contact
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Work Email</p>
                  <p className="text-sm font-bold text-gray-700">{contact.work_email || "N/A"}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Town</p>
                  <p className="text-sm font-bold text-gray-700">{contact.town || contact.organization?.town || "N/A"}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-xs text-gray-800 font-bold leading-relaxed">
                    {[
                      contact.street || contact.organization?.street,
                      contact.address_line_1 || contact.organization?.address_line_1,
                      contact.postcode || contact.organization?.postcode
                    ].filter(Boolean).join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <FiActivity className="text-brand-primary" /> Recent Activity
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-gray-100">
                <div className="mt-1 p-2 bg-blue-100 text-brand-primary rounded-lg shrink-0">
                  <FiCalendar size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Contact profile created</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {contact.created_at ? new Date(contact.created_at).toLocaleDateString("en-GB", { 
                      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" 
                    }) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="space-y-6">

          {/* Actions Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <FiUser className="text-brand-primary" /> Management
            </h3>
            
            <button 
              onClick={() => setOpenEdit(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95"
            >
              <FiEdit3 /> Edit Profile
            </button>
            
            <button 
              onClick={() => setDeleteId(contact.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-100 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all active:scale-95"
            >
              <FiTrash2 /> Delete Contact
            </button>
          </div>

          {/* Organization Context Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <HiOutlineOfficeBuilding className="text-brand-primary" /> School Context
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Phase</span>
                <span className="text-xs font-bold text-gray-700">{contact.organization?.phase || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Gender</span>
                <span className="text-xs font-bold text-gray-700">{contact.organization?.gender || "Mixed"}</span>
              </div>
              {contact.organization?.urn && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">URN</span>
                  <span className="text-xs font-bold text-gray-700">{contact.organization.urn}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditContactModal
        open={openEdit}
        contact={contact}
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
