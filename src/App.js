import React from 'react'
import Router from './app/routes'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from "react-hot-toast";


const App = () => {
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