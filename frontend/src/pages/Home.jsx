import React from 'react';
import Category1 from './Category1.jsx';
import Container from './Container.jsx';
import Mission from './Mission.jsx';
import EverlaneFavorites from './Favourites.jsx';


const Home = () => {
  return (
    <div>
      <Container />
      <Category1 />
      <Mission />
      <EverlaneFavorites />
    </div>
  )
}

export default Home;