const ConfirmDeleteModal = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>

        <p className="text-sm text-gray-600 mt-2">
          {description}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
