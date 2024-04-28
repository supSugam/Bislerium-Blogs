import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/_layout';
import Home from './Components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<></>} />
          <Route path="contact" element={<></>} />
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
