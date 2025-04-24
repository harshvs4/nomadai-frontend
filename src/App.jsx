import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';
import AppRoutes from './routes';

function App() {
  return (
    <TravelProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <AppRoutes />
        </div>
      </Router>
    </TravelProvider>
  );
}

export default App;