import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchLatestPromptTemplate, fetchPromptById } from "../actions";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "react-quill/dist/quill.snow.css";
import "../css/PromptEditPage.css";

function PromptEditPage() {
  const { promptId } = useParams();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [promptTemplate, setPromptTemplate] = useState<PromptTemplate | null>(
    null
  );

  if (!promptId) {
    throw new Error("Prompt ID is required.");
  }

  useEffect(() => {
    const fetchAndSetPrompts = async () => {
      const fetchedPrompt = await fetchPromptById(promptId);
      const fetchedPromptTemplate = await fetchLatestPromptTemplate(promptId);
      setPrompt(fetchedPrompt);
      setPromptTemplate(fetchedPromptTemplate);
    };
    fetchAndSetPrompts();
  }, []);
  return (
    <Header>
      {prompt === null && <p>Loading...</p>}
      {prompt && (
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group controlId="promptTitle">
                    <Form.Label>
                      <h2>{prompt.name}</h2>
                    </Form.Label>
                    <Form.Text className="text-muted">
                      <h4>{prompt.description}</h4>
                    </Form.Text>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      defaultValue={
                        promptTemplate ? promptTemplate.template : ""
                      }
                    />
                  </Form.Group>
                  <Button variant="primary" className="mt-3">
                    Save Template
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Header>
  );
}

export default PromptEditPage;
