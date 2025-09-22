interface ModalProps {
  open: boolean; //
  onClose: () => void; //
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null; //

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2">
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
