import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/main';
import About from './pages/about';
import Add from './pages/add';
import Layout from './components/layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pwa-progress/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="about" element={<About />} />
          <Route path="add" element={<Add />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
