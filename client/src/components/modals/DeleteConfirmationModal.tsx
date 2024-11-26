import React from 'react';
import '../../styles/Modal.css';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirmation">
        <div className="modal-header">
          <h2>Confirm Deletion</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="confirmation-message">
          <p>Are you sure you want to delete <strong>{itemName}</strong>?</p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="delete-button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 