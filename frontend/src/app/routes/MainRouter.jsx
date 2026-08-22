import { createBrowserRouter } from 'react-router';
import Home from '../../features/home/pages/Home.jsx';
import Login from '../../features/auth/pages/Login.jsx';
import Register from '../../features/auth/pages/Register.jsx';

export const MainRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
