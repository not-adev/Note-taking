import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import Sign_in from './components/Sign_in';
import Sign_up from './components/Sign-up';
import Notes from './components/Notes';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Sign_in />} />
      <Route path="/signup" element={<Sign_up />} />
      <Route path="/notes" element={<Notes />} />
    </Routes>

  )
}

export default App
