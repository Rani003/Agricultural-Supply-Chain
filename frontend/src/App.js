import React from 'react';
import RegisterFarmer from './components/RegisterFarmer';
import TrackProduct from './components/TrackProduct';
import UpdateProductStatus from './components/UpdateProductStatus';
import DatabaseView from './components/DatabaseView'; // Tambahkan import ini

function App() {
  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>Sistem Rantai Pasok Pertanian</h1>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
      }}>
        <RegisterFarmer />
        <hr />
        <TrackProduct />
        <hr />
        <UpdateProductStatus />
       	<hr />
        <DatabaseView /> {/* Tambahkan komponen DatabaseView */}
      </div>
    </div>
  );
}

export default App;
