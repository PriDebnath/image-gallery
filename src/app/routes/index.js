import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Gallery from '../container/gallery'

const Router = () => {
  return (
    <Routes>
        <Route path="/gallery" element={<Gallery/>}/>

    </Routes>
  )
}

export default Router