import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaRocket, FaShieldAlt, FaUsers } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="bg-light py-5 mb-5 rounded-3">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Benvenuto in Tropea.biz</h1>
              <p className="lead mb-4 text-muted">
                La soluzione completa per gestire i tuoi progetti, team e permessi in modo semplice e sicuro.
                Inizia oggi stesso a trasformare il tuo modo di lavorare.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link as any} to="/register" variant="primary" size="lg" className="px-4">
                  Inizia Gratis
                </Button>
                <Button as={Link as any} to="/login" variant="outline-secondary" size="lg" className="px-4">
                  Accedi
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img 
                src="https://placehold.co/600x400?text=Hero+Image" 
                alt="Hero Illustration" 
                className="img-fluid rounded shadow-sm"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold">Perché sceglierci?</h2>
            <p className="text-muted">Tutto ciò di cui hai bisogno per scalare il tuo business.</p>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <div className="mb-3 text-primary">
                  <FaShieldAlt size={50} />
                </div>
                <Card.Title as="h4">Sicurezza Avanzata</Card.Title>
                <Card.Text className="text-muted">
                  Protezione dei dati di livello enterprise con autenticazione robusta e gestione granulare dei permessi.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <div className="mb-3 text-primary">
                  <FaRocket size={50} />
                </div>
                <Card.Title as="h4">Performance Top</Card.Title>
                <Card.Text className="text-muted">
                  Un'interfaccia veloce e reattiva costruita con le ultime tecnologie per garantirti la massima efficienza.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <div className="mb-3 text-primary">
                  <FaUsers size={50} />
                </div>
                <Card.Title as="h4">Collaborazione Team</Card.Title>
                <Card.Text className="text-muted">
                  Strumenti pensati per far lavorare insieme i tuoi team in armonia, ovunque si trovino.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-primary text-white py-5 rounded-3 mb-5">
        <Container className="text-center">
          <h2 className="mb-4">Pronto a partire?</h2>
          <p className="lead mb-4">Unisciti a migliaia di utenti soddisfatti che hanno già migliorato il loro workflow.</p>
          <Link to="/register" className="btn btn-light btn-lg px-5 text-primary fw-bold">
            Registrati Ora
          </Link>
        </Container>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-4 border-top">
        <Container>
          <p className="mb-0">&copy; 2026 Tropea.biz. Tutti i diritti riservati.</p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
