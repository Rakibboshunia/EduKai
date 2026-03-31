import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

import DynamicSearch from "../components/DynamicSearch";
import AddOrganizationModal from "../components/AddOrganizationModal";
import EditContactModal from "../components/EditContactModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ImportExcelButton from "../components/ImportExcelButton";
import ContactCard from "../components/ContactCard";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
} from "../api/contactApi";

import { getOrganizations } from "../api/organizationApi";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  const [industry, setIndustry] = useState("");

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");

  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH CONTACTS ================= */
  const fetchContacts = async (url) => {
    try {
      const data = await getContacts(url);
      const results = data?.results || [];

      setContacts(results);
      setSearchData(results);
      // setFilteredData(results);

      setNext(data?.pagination?.next);
      setPrevious(data?.pagination?.previous);

      setPage(data?.pagination?.page || 1);
      setTotalPages(data?.pagination?.total_pages || 1);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH ORGANIZATIONS ================= */
  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizations();
      const data = res?.results || [];

      setOrganizations(data);

      // default select first org
      if (data.length > 0) {
        setSelectedOrg(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchOrganizations();
  }, []);

  /* ================= IMPORT ================= */
  const handleImportContacts = async (file) => {
    try {
      if (!selectedOrg) {
        alert("Please select organization first");
        return;
      }

      await importContacts(file, selectedOrg);
      fetchContacts();
    } catch (err) {
      console.error(err);
      alert("Import failed!");
    }
  };

  /* ================= SEARCH ================= */
  const handleSearchFilter = (data) => {
    setSearchData(data);
  };

  useEffect(() => {
    setFilteredData(searchData);
  }, [searchData]);

  /* ================= ADD ================= */
  const handleAddContact = async (formData) => {
    try {
      if (!selectedOrg) {
        alert("Please select organization first");
        return;
      }

      await createContact(selectedOrg, {
        contact_person: formData.contact_person,
        job_title: formData.job_title || null,
        work_email: formData.work_email,
      });

      fetchContacts();
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    const contact = contacts.find((c) => c.id === id);
    setSelectedContact(contact);
    setOpenEdit(true);
  };

  const handleUpdateContact = async (data) => {
    try {
      await updateContact(data.id, {
        contact_person: data.contact_person,
        job_title: data.job_title || null,
        work_email: data.work_email,
      });

      fetchContacts();
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteContact(deleteId);
      setDeleteId(null);
      fetchContacts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= PAGINATION ================= */
  const getVisiblePages = () => {
    let start = Math.max(page - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="p-3 sm:p-5 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2D468A]">
            Contacts Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage recipient contacts and track relationships.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-[#2D468B] text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <FiPlus /> Add Contact
          </button>

          <ImportExcelButton onFileUpload={handleImportContacts} />
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/70 p-4 sm:p-5 rounded-xl border mb-8 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <DynamicSearch
            data={contacts}
            searchKeys={[
              "contact_person",
              "job_title",
              "work_email",

              // 🔥 fallback keys (important)
              "name",

              // 🔥 nested (if exists)
              "organization.name",
              "organization.town",
            ]}
            onFilter={handleSearchFilter}
          />
        </div>

        <div className="w-full md:w-1/2">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/60 text-black border border-[#2D468A] focus:outline-none focus:ring-2 focus:ring-[#2D468A]"
          >
            <option value="">Select Job Title</option>
            <option value="nursery">Nursery</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="16plus">16 plus</option>
            <option value="not_applicable">Not Applicable</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredData.map((contact) => (
          <ContactCard
            key={contact.id}
            data={contact}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
        <button
          disabled={!previous}
          onClick={() => fetchContacts(previous)}
          className="px-3 py-2 border rounded-lg hover:bg-[#2D468A] hover:text-white disabled:opacity-40"
        >
          Prev
        </button>

        {getVisiblePages().map((p) => (
          <button
            key={p}
            onClick={() =>
              fetchContacts(`/api/organizations/contacts/?page=${p}`)
            }
            className={`px-3 py-2 border rounded-lg ${
              page === p ? "bg-[#2D468A] text-white" : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={!next}
          onClick={() => fetchContacts(next)}
          className="px-3 py-2 border rounded-lg hover:bg-[#2D468A] hover:text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <AddOrganizationModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddContact}
        type="contact"
      />

      <EditContactModal
        open={openEdit}
        contact={selectedContact}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdateContact}
      />

      <ConfirmDeleteModal
        open={deleteId !== null}
        title="Delete Contact"
        description="Are you sure?"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}