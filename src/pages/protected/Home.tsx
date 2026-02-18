import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { useAppSelector } from '../../hooks/store';

const Home: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);


  return (
    <Container fluid className="p-0">
      <div className="mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          Benvenuto, {user?.name} {user?.surname}
        </h1>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-5">
          <h4 className="mb-4">Panoramica Dashboard</h4>
          <p className="lead text-muted">
            Seleziona una voce dal menu a sinistra per accedere alle funzionalità del tuo gruppo.
          </p>
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;
