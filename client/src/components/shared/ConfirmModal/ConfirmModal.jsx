import React from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * Reusable confirmation modal for delete or other confirm actions.
 * @param {boolean} show - Whether the modal is visible
 * @param {function} onHide - Called when modal is closed (Cancel or X)
 * @param {function} onConfirm - Called when user clicks the confirm button
 * @param {string} title - Modal title
 * @param {string} [message] - Body text (ignored if children is provided)
 * @param {React.ReactNode} [children] - Optional custom body content (overrides message)
 * @param {string} [confirmLabel='Delete'] - Confirm button text
 * @param {string} [confirmVariant='danger'] - Confirm button variant
 * @param {string} [cancelLabel='Cancel'] - Cancel button text
 */
const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message = "",
  children,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children != null ? children : <p className="mb-0">{message}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
