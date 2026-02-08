import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const DeleteAction = ({ organizationName, onDelete }) => {
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenDelete(true)}
        className="text-red-500 hover:text-red-700 transition text-xl cursor-pointer"
        title="Delete"
      >
        <FiTrash2 />
      </button>

      <ConfirmDeleteModal
        open={openDelete}
        title="Delete Organization"
        description={`Are you sure you want to delete "${organizationName}"? This action cannot be undone.`}
        onCancel={() => setOpenDelete(false)}
        onConfirm={() => {
          onDelete();
          setOpenDelete(false);
        }}
      />
    </>
  );
};

export default DeleteAction;
