import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantSearch = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/restaurants`);
        setRestaurants(response.data); 
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <div style={styles.loader}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Restaurants</h1>
      <div style={styles.cardContainer}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} style={styles.card}>
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              style={styles.image}
            />
            <h2 style={styles.name}>{restaurant.name}</h2>
            <p style={styles.description}>{restaurant.description || 'No description available.'}</p>
            <p style={styles.location}>{restaurant.location ? `${restaurant.location.address}, ${restaurant.location.city}` : 'Location not available'}</p>
            <p style={styles.rating}>Rating: {restaurant.rating || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    justifyItems: 'center',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: '#fff',
    textAlign: 'center',
    padding: '10px',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  name: {
    fontSize: '1.5rem',
    marginTop: '10px',
    color: '#34495e',
  },
  description: {
    fontSize: '1rem',
    color: '#7f8c8d',
    marginTop: '10px',
  },
  location: {
    fontSize: '1rem',
    color: '#16a085',
    marginTop: '5px',
  },
  rating: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '10px',
    color: '#2c3e50',
  },
  loader: {
    textAlign: 'center',
    fontSize: '1.5rem',
    marginTop: '20px',
    color: '#3498db',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: 'red',
    marginTop: '20px',
  },
};

export default RestaurantSearch;
