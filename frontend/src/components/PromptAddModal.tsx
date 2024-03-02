import { useState } from "react";
import { Modal } from "react-bootstrap";
import PromptAddForm from "./PromptAddForm";

interface PromptAddModalProps {
  show: boolean;
  onHide: () => void;
  onNewPrompt: (prompt: Prompt) => void;
}

function PromptAddModal(props: PromptAddModalProps) {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  return (
    <Modal
      show={props.show}
      onHide={() => {
        setFormSubmitted(false);
        props.onHide();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a new prompt
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formSubmitted && <h4>Your prompt has been successfully created</h4>}
        {!formSubmitted && (
          <PromptAddForm
            handleSuccess={(prompt: Prompt) => {
              setFormSubmitted(true);
              props.onNewPrompt(prompt);
            }}
            handleFailure={e => {
              console.log(e);
              setFormSubmitted(true);
            }}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PromptAddModal;
