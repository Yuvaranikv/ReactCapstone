import React, { useEffect, useState } from 'react';
import { Card, Badge, Container, Row, Col } from 'react-bootstrap';
import './IncompleteTasks.css';

const CompleteTasks = ({ userId }) => {
    const [incompleteTasks, setIncompleteTasks] = useState([]);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8083/api/todos/byuser/${userId}?completed=true`)
                .then(response => response.json())
                .then(data => setIncompleteTasks(data))
                .catch(error => console.error('Error fetching incomplete tasks:', error));
        }
    }, [userId]);

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High':
                return <Badge bg="danger" className="badge-high">High</Badge>;
            case 'Medium':
                return <Badge bg="warning" className="badge-medium">Medium</Badge>;
            case 'Low':
                return <Badge bg="success" className="badge-low">Low</Badge>;
            default:
                return <Badge bg="secondary" className="uniform-badge">Unknown</Badge>;
        }
    };

    return (
        <>
            <Container className="mt-1">
                <Row className="align-items-center mb-1">
                    <Col md={6}>
                        {incompleteTasks.length === 0 ? (
                            <p>No incomplete tasks</p>
                        ) : (
                            incompleteTasks.map(todo => (
                                // IncompleteTasks.js

                                // Inside the map function where you render the cards
                                <Card key={todo.id} className="mb-2">
                                    <Card.Body className="d-flex justify-content-between">
                                        <div>
                                            <Card.Title>{todo.description}</Card.Title>
                                            <Card.Text>
                                                {todo.category} &nbsp;
                                                <span>{todo.deadline}</span>&nbsp;
                                            </Card.Text>
                                        </div>
                                        {/* Priority Badge */}
                                        <div className="priority-badge">
                                            {getPriorityBadge(todo.priority)}
                                        </div>
                                    </Card.Body>
                                </Card>

                            ))
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CompleteTasks;
