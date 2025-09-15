import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TextGallery.css';

const TextGallery = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL del backend Laravel (ruta pública)
  const API_URL = process.env.REACT_APP_API_URL + '/poems/public' || 'http://localhost:8000/api/poems/public';
  
  // Función para obtener los poemas desde la API
  const fetchPoems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching poems from:', API_URL);

      const response = await axios.get(API_URL);
      
      console.log('Response received:', response.data);
      
      // La API ahora devuelve directamente un array de poemas
      if (Array.isArray(response.data)) {
        setTexts(response.data);
      } else {
        // Fallback por si la estructura cambia
        setTexts(response.data.data || response.data);
      }
    } catch (err) {
      console.error('Error fetching poems:', err);
      setError(`Error al cargar poemas: ${err.response?.data?.message || err.message}`);
      
      // Cargar datos de ejemplo si hay un error
      setTexts([
        {
          id: 1,
          title: "Siempre tú",
          content: "Siempre fuiste el sonido de las olas que calma mi corazón cuando los vientos de la vida golpean fuerte.\n\nEn cada amanecer, en cada atardecer,\ntu recuerdo me acompaña como una melodía eterna.",
          author: "RapsodAz",
          color: '#8B5CF6'
        },
        {
          id: 2,
          title: "Odisea",
          content: "No sé cómo llegamos al punto donde necesito de ti para poder sonreír, donde todo lo que pasamos no fue más que un efímero adiós que nunca supimos pronunciar.\n\nLa distancia se convierte en un océano\nque separa dos almas que se buscan.",
          author: "RapsodAz",
          color: '#BD92FC'
        },
        {
          id: 3,
          title: "Reflexiones Nocturnas",
          content: "En la quietud de la noche, cuando el mundo duerme,\nlas palabras cobran vida en mi mente.\n\nCada verso es un suspiro,\ncada estrofa un latido del corazón.",
          author: "RapsodAz",
          color: '#5E5E97'
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
      <header className="gallery-header">
        <h1>Bienvenidos</h1> 
        <h2>Mis pobres versos y yo (RapsodAz)</h2>
        <div className="connection-status">
          {loading ? (
            <span className="status loading">🔄 Cargando poemas...</span>
          ) : error ? (
            <span className="status error">⚠️ Modo offline - Mostrando poemas de ejemplo</span>
          ) : (
            <span className="status success">✅ Conectado - {texts.length} poemas cargados</span>
          )}
        </div>
      </header>
      
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
              <div className="poem-content">
                {text.content.split('\n').map((line, index) => (
                  <p key={index} className={line.trim() === '' ? 'poem-line-break' : 'poem-line'}>
                    {line}
                  </p>
                ))}
              </div>
              <p className='text-author'>— {text.author}</p>
              <button onClick={() => {
                const colors = ['#8B5CF6', '#BD92FC', '#5E5E97', '#17AD92', '#F59E0B', '#EF4444'];
                const currentIndex = colors.indexOf(text.color);
                const nextColor = colors[(currentIndex + 1) % colors.length];
                setTexts(prevTexts => 
                  prevTexts.map(t => 
                    t.id === text.id ? { ...t, color: nextColor } : t
                  )
                );
              }}>🎨 Cambiar Color</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextGallery;
