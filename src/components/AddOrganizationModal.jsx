import AddOrganizationForm from "./AddOrganizationForm";
import AddContactForm from "./AddContactForm";

const AddOrganizationModal = ({
  open,
  onClose,
  onSubmit,
  type = "organization",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      <div className="bg-white w-full max-w-2xl max-h-full overflow-y-auto rounded-xl shadow-lg border border-gray-100 p-5 sm:p-10 relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6 sticky top-0 bg-white z-10 pb-2 border-b sm:border-none sm:pb-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#2D468A]">
            {type === "organization"
              ? "Add Organization"
              : "Add Contact"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            ✕
          </button>
        </div>

        {type === "organization" ? (
          <AddOrganizationForm
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
            onCancel={onClose}
          />
        ) : (
          <AddContactForm
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AddOrganizationModal;