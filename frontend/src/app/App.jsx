import React from 'react'
import { MainRouter } from './routes/MainRouter.jsx'
import { RouterProvider } from 'react-router'
import AuthSessionLoader from '../features/auth/components/AuthSessionLoader.jsx'

const App = () => {
  return (
    <>
      <AuthSessionLoader />
      <RouterProvider router={MainRouter} />
    </>
  )
}

export default App
