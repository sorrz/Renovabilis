import React from 'react';
import './Dashboard.css';  

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
            <p>Om du ser detta betyder det att komponenten fungerar.</p>

      <div className="widgets-grid">
        <div className="widget">Widget 1 (Placeholder)</div>
        <div className="widget">Widget 2 (Placeholder)</div>
        <div className="widget">Widget 3 (Placeholder)</div>
        <div className="widget">Widget 4 (Placeholder)</div>
      </div>
    </div>
  );
};

export default Dashboard;
