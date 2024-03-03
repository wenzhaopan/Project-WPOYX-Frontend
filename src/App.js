import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Add from './Pages/Add';
import Edit from './Pages/Edit';
import View from './Pages/View';


{/* used React-router-dom library to have two pages, one for creating a listing, one as a home*/}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/edit" element={<Edit/>}/>
        <Route path="/view" element={<View/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;