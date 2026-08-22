import React from 'react'
import { MainRouter } from './routes/MainRouter.jsx'
import { RouterProvider } from 'react-router'
import { useUsers } from '../features/users/hooks/useUsers.js'
import { useEffect } from 'react'

const App = () => {

  const {handleGetUser} = useUsers()

  useEffect(() => {
    handleGetUser()
  },[])

  return (
    <RouterProvider router={MainRouter} />
  )
}

export default App
