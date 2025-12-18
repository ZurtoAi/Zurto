import React from "react";
import "./ConfirmationModal.css";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: string[];
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "success";
  icon?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  details,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  icon = "🤔",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-icon">{icon}</div>
        <h2 className="confirmation-title">{title}</h2>
        <p className="confirmation-message">{message}</p>

        {details && details.length > 0 && (
          <div className="confirmation-details">
            {details.map((detail, idx) => (
              <div key={idx} className="detail-item">
                <span className="detail-bullet">•</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}

        <div className="confirmation-actions">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn-confirm ${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
