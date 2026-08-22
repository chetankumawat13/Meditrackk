import React from 'react'
import { MainRouter } from './routes/MainRouter.jsx'
import { RouterProvider } from 'react-router'

const App = () => {
  return (
    <RouterProvider router={MainRouter} />
  )
}

export default App
