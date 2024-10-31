import React, { useState } from 'react';
import MissionList from './components/MissionList/MissionList';
import './App.css';


const apiKey = '8161714'; 
const BASE_URL = 'https://reactexambackend.onrender.com/missions'; 

const App: React.FC = () => {
  const [refresh, setRefresh] = useState(false); 

  return (
    <div className="app">
      <header className="app-header">
        <h1>Military Task Manager</h1>
      </header>
      <MissionList apiKey={apiKey} baseUrl={BASE_URL} refresh={refresh} />
    </div>
  );
};

export default App;
