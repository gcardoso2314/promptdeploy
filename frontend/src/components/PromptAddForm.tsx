import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { addNewPrompt } from "../actions";

interface PromptAddFormProps {
  handleSuccess: (prompt: Prompt) => void;
  handleFailure: (error: Error) => void;
}

function PromptAddForm({ handleSuccess, handleFailure }: PromptAddFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(`Adding new prompt: ${name}`);
      const newPrompt = await addNewPrompt(name, description);
      handleSuccess(newPrompt);
    } catch (error) {
      handleFailure(Error(`Failed to create prompt ${name}: ${error}`));
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Prompt Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a name for your prompt"
          onChange={e => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Prompt Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a brief description of your prompt"
          onChange={e => setDescription(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default PromptAddForm;
