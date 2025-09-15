import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TextGallery.css';

const TextGallery = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL del backend Laravel
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/poems';
  
  // Función para obtener los poemas desde la API
  const fetchPoems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      setTexts(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      // Cargar datos de ejemplo si hay un error
      setTexts([
        {
          id: 1,
          title: "Siempre tú",
          content: "Siempre fuiste el sonido de las olas que calma mi corazon cuando los vientos de la vida golpean fuerte.",
          author: "RapsodAz",
          color: 'purple'
        },
        {
          id: 2,
          title: "Odisea",
          content: "No se como llegamos al punto donde necesite de ti para poder sonreir, donde todo lo que pasamos no fue mas que un efimero adios que nunca supimos pronunciar.",
          author: "RapsodAz",
          color: '#bd92fc'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar poemas al montar el componente
  useEffect(() => {
    fetchPoems();
  }, []);

  return (
    <div className="text-gallery">
      <h1>Bienvenidos</h1> 
      <h1>Mis pobres versos y yo(rapsodaz)</h1>
      
      {loading ? (
        <div className="loading">
          <p>Cargando poemas...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchPoems}>Reintentar</button>
        </div>
      ) : (
        <div className="text-container">
          {texts.map((text) => (
            <div key={text.id} className="text-card" style={{ backgroundColor: text.color }}>
              <h2>{text.title}</h2>
              <p>{text.content}</p>
              <p className='text-author'>{text.author}</p>
              <button onClick={() => {
                const colors = ['purple', '#bd92fc', '#5e5e97', '#17ad92'];
                const currentIndex = colors.indexOf(text.color);
                const nextColor = colors[(currentIndex + 1) % colors.length];
                setTexts(prevTexts => 
                  prevTexts.map(t => 
                    t.id === text.id ? { ...t, color: nextColor } : t
                  )
                );
              }}>Cambiar Color</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextGallery;
