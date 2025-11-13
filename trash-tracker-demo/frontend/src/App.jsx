import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from './pages/UserPage';
import CollectorPage from './pages/CollectorPage';
import { socket, SocketContext } from './context/socket';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/collector" element={<CollectorPage />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
