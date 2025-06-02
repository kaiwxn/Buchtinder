import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function LogoutConfirmModal({ onCancel, onConfirm }) {
    const modalRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onCancel();
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                onCancel();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onCancel]);

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-white ">

            <div
                ref={modalRef}
                className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center animate-fadeIn mt-60"
            >
                <h2 className="text-lg font-semibold mb-4">Abmelden bestätigen</h2>
                <p className="mb-6">Möchten Sie sich wirklich abmelden?</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Ja, abmelden
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}

export default LogoutConfirmModal;
