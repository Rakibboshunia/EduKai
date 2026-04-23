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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky -top-6 sm:-top-8 bg-white/95 backdrop-blur z-10 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2D468A] shadow-inner">
              <span className="text-xl">{type === "organization" ? "🏢" : "👤"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {type === "organization"
                ? "Add Organization"
                : "Add Contact"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
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