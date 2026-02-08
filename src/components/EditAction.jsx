import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import EditOrganizationModal from "./EditOrganizationModal";

const EditAction = ({ organization, onUpdate }) => {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenEdit(true)}
        className="text-[#2D468A] hover:text-blue-700 transition text-xl cursor-pointer"
        title="Edit"
      >
        <FiEdit2 />
      </button>

      <EditOrganizationModal
        open={openEdit}
        organization={organization}
        onClose={() => setOpenEdit(false)}
        onSave={(updatedOrg) => {
          onUpdate(updatedOrg);
          setOpenEdit(false);
        }}
      />
    </>
  );
};

export default EditAction;
