import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/main';
import About from './pages/about';
import TaskAdd from './pages/taskadd';
import MuLayout from './components/mulayout';
import TaskList from './pages/tasklist';
import MuImportExport from './components/muimportexport';
import TaskDetail from './pages/taskdetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pwa-progress/" element={<MuLayout />}>
          <Route index element={<Main />} />
          <Route path="importexport" element={<MuImportExport />} />
          <Route path="about" element={<About />} />
          <Route path="task-add" element={<TaskAdd />} />
          <Route path="task-list" element={<TaskList />} />
          <Route path="task-detail/:id" element={<TaskDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
