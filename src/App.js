import React from 'react'
import Router from './app/routes'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from "react-hot-toast";


const App = () => {
  console.log(process.env.REACT_APP_ACCESS_KEY);
  return (
  <>
    <BrowserRouter>
     <Router/>
    </BrowserRouter>
    <Toaster />
    </>
  )
}

export default App