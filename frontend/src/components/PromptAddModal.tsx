import { useState } from "react";
import { Modal, Button, Paper, Text, Space } from "@mantine/core";
import PromptAddForm from "./PromptAddForm";

interface PromptAddModalProps {
  opened: boolean;
  onClose: () => void;
  onNewPrompt: (prompt: Prompt) => void;
}

function PromptAddModal(props: PromptAddModalProps) {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  return (
    <Modal
      opened={props.opened}
      onClose={() => {
        setFormSubmitted(false);
        props.onClose();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      title="Enter the details of your new prompt below"
    >
      <Paper radius="md" p="xl" withBorder {...props}>
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
      </Paper>
    </Modal>
  );
}

export default PromptAddModal;
