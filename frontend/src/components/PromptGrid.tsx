import { FunctionComponent, useEffect, useState } from "react";
import PromptCard from "./PromptCard";
import { Button, Col, Row } from "react-bootstrap";
import PromptAddModal from "./PromptAddModal";
import { fetchUserPrompts } from "../actions";
import { camelizeKeys } from "humps";

export const PromptGrid: FunctionComponent = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newPromptModalVisible, setNewPromptModalVisible] =
    useState<boolean>(false);

  const addNewPrompt = (newPrompt: Prompt) => {
    setPrompts(prevPrompts => [...prevPrompts, newPrompt]);
  };

  useEffect(() => {
    const fetchAndSetPrompts = async () => {
      const data = await fetchUserPrompts();
      setPrompts(camelizeKeys(data));
      setIsLoading(false);
    };
    try {
      fetchAndSetPrompts();
    } catch (error) {
      setError("Failed to fetch prompts.");
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this effect runs once on mount
  return (
    <>
      {error && <Row>Something went wrong when loading prompts.</Row>}
      {isLoading && <Row>Loading prompts...</Row>}
      <Row>
        {prompts.map(prompt => (
          <PromptCard
            key={prompt.id}
            id={prompt.id}
            name={prompt.name}
            description={prompt.description}
            createdAt={prompt.createdAt}
          />
        ))}
      </Row>
      <Row className="justify-content-center">
        <Col className="d-flex justify-content-center" md={9}>
          <Button onClick={() => setNewPromptModalVisible(true)}>
            Add New Prompt
          </Button>
        </Col>
      </Row>
      <PromptAddModal
        show={newPromptModalVisible}
        onHide={() => setNewPromptModalVisible(false)}
        onNewPrompt={addNewPrompt}
      />
    </>
  );
};
