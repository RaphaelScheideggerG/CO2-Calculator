import React from 'react';
import DistanceForm from './DistanceForm';

const MainPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', padding: 24 }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2.2rem' }}>CO2 Calculator</h1>
        <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.7)' }}>Estimativa rápida de emissões por deslocamento</p>
      </header>

      <DistanceForm />
    </div>
  );
};

export default MainPage;