// src/App.js
import React, { useState, useEffect } from 'react';
import { buscarRecetasPorIngredientes, buscarRecetaPorID, obtenerListaDeIngredientes } from './RecetasService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Importa los estilos personalizados
import { Modal, Button, Navbar, Container, Nav, Form, ListGroup, Row, Col } from 'react-bootstrap';

const ingredientesBasicos = ["Chicken", "Beef", "Pork", "Tomato", "Cheese", "Onion", "Garlic", "Carrot"];

function App() {
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [listaIngredientes, setListaIngredientes] = useState([]);

  useEffect(() => {
    const cargarIngredientes = async () => {
      const ingredientes = await obtenerListaDeIngredientes();
      setListaIngredientes(ingredientes);
    };
    cargarIngredientes();
  }, []);

  const agregarIngrediente = (ingrediente) => {
    if (ingrediente && !ingredientes.includes(ingrediente)) {
      setIngredientes([...ingredientes, ingrediente]);
      setNuevoIngrediente('');
      setSugerencias([]);
    }
  };

  const eliminarIngrediente = (ingrediente) => {
    setIngredientes(ingredientes.filter((ing) => ing !== ingrediente));
  };

  const manejarCambio = (e) => {
    const valor = e.target.value;
    setNuevoIngrediente(valor);

    if (valor.length > 1) {
      const coincidencias = listaIngredientes.filter((ing) =>
        ing.toLowerCase().startsWith(valor.toLowerCase())
      );
      setSugerencias(coincidencias);
    } else {
      setSugerencias([]);
    }
  };

  const manejarSeleccionBasico = (e) => {
    const ingrediente = e.target.value;
    if (e.target.checked) {
      agregarIngrediente(ingrediente);
    } else {
      eliminarIngrediente(ingrediente);
    }
  };

  const buscarRecetas = async () => {
    setError(null);
    const resultados = await buscarRecetasPorIngredientes(ingredientes);
    if (resultados.length === 0) {
      setError("No se encontraron recetas con los ingredientes seleccionados.");
    }
    setRecetas(resultados);
  };

  const mostrarDetalles = async (receta) => {
    const detallesCompletos = await buscarRecetaPorID(receta.idMeal);
    setRecetaSeleccionada(detallesCompletos);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setRecetaSeleccionada(null);
  };

  return (
    <div>
      {/* Barra de Navegación con fondo púrpura y texto en blanco */}
      <Navbar style={{ backgroundColor: '#6c5ce7' }} expand="lg">
  <Container>
    {/* Nombre de la aplicación alineado a la izquierda */}
    <Navbar.Brand href="#" className="text-white">Yixha</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      {/* Opciones de navegación alineadas a la derecha */}
      <Nav className="ms-auto">
        <Nav.Link href="#" className="text-white">Inicio</Nav.Link>
        <Nav.Link href="#" className="text-white">Buscador</Nav.Link>
        <Nav.Link href="#" className="text-white">Equipo</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


      <Container className="my-4">
        <h2 className="text-center mb-4">Buscador de Recetas</h2>

        {/* Casillas de verificación para ingredientes básicos */}
        <Row className="mb-3">
          <Col>
            <h5>Ingredientes Básicos:</h5>
            {ingredientesBasicos.map((ing, index) => (
              <Form.Check 
                key={index}
                type="checkbox"
                label={ing}
                value={ing}
                checked={ingredientes.includes(ing)}
                onChange={manejarSeleccionBasico}
                inline
              />
            ))}
          </Col>
        </Row>

        {/* Campo de autocompletado para ingredientes */}
        <Form.Group className="mb-3 position-relative">
          <Form.Control
            type="text"
            value={nuevoIngrediente}
            onChange={manejarCambio}
            placeholder="Buscar y agregar ingrediente"
          />
          {sugerencias.length > 0 && (
            <ListGroup className="position-absolute w-100 z-3">
              {sugerencias.map((sugerencia, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => agregarIngrediente(sugerencia)}
                >
                  {sugerencia}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        <div className="mb-3">
          <h5>Ingredientes seleccionados:</h5>
          <ul className="list-group">
            {ingredientes.map((ing, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {ing}
                <Button variant="danger" size="sm" onClick={() => eliminarIngrediente(ing)}>
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={buscarRecetas} variant="success" className="w-100 mb-4">
          Buscar Recetas
        </Button>

        {error && <p className="text-danger text-center">{error}</p>}

        {/* Resultados de Recetas */}
        <div className="row">
          {recetas.map((receta) => (
            <div key={receta.idMeal} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img src={receta.strMealThumb} className="card-img-top" alt={receta.strMeal} />
                <div className="card-body">
                  <h5 className="card-title">{receta.strMeal}</h5>
                  <Button variant="info" onClick={() => mostrarDetalles(receta)}>
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Detalles de Receta */}
        <Modal show={showModal} onHide={cerrarModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{recetaSeleccionada?.strMeal || "Detalles de la Receta"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {recetaSeleccionada && (
              <>
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src={recetaSeleccionada.strMealThumb}
                    alt={recetaSeleccionada.strMeal}
                    className="img-fluid"
                    style={{ maxWidth: "400px", borderRadius: "8px" }}
                  />
                </div>
                <p><strong>Categoría:</strong> {recetaSeleccionada.strCategory || 'N/A'}</p>
                <p><strong>Área:</strong> {recetaSeleccionada.strArea || 'N/A'}</p>
                
                <h5>Ingredientes:</h5>
                <ul>
                  {Object.keys(recetaSeleccionada)
                    .filter((key) => key.startsWith('strIngredient') && recetaSeleccionada[key])
                    .map((key, index) => (
                      <li key={index}>{recetaSeleccionada[key]}</li>
                    ))}
                </ul>

                <h5 className="mt-4">Instrucciones:</h5>
                <p>{recetaSeleccionada.strInstructions || 'Instrucciones no disponibles.'}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default App;
