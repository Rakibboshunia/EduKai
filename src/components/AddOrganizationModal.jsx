import AddOrganizationForm from "./AddOrganizationForm";

const AddOrganizationModal = ({ open, onClose, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-gray-100 p-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#2D468A]">
            Add New Organization
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <AddOrganizationForm
          onSubmit={(data) => {
            onSubmit(data);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default AddOrganizationModal;
