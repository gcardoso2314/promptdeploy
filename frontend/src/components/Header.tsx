import { ReactNode } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../AuthContext";

interface HeaderProps {
  children: ReactNode;
}

function Header({ children }: HeaderProps) {
  const { logout } = useAuth();
  return (
    <Container fluid className="p-0 m-0">
      <Row className="header align-items-center px-3">
        <Col>
          <a href="/" className="link-unstyled">
            PromptDeploy
          </a>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="outline-secondary" onClick={logout}>
            Logout
          </Button>
        </Col>
      </Row>
      {children}
    </Container>
  );
}

export default Header;
