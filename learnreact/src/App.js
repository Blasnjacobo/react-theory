import React from 'react';
//import Navbar from "./Header/Navbar";
//import Main from './Main/Main';
import NotesApp from './Extra/NotesApp';
import "./Extra/NotesApp.css"


export default function App() {
  /*const [darkMode, setDarkMode] = React.useState(true)
  function toggleDarkMode(){
    setDarkMode(prevMode => !prevMode)
  }*/

  return(  
  /*<div className='container'>
      <Navbar darkMode= {darkMode} toggleDarkMode={toggleDarkMode}/>
      <Main darkMode= {darkMode}/>
  </div>*/
  <NotesApp />                
)}

