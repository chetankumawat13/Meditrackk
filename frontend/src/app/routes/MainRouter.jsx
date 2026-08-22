import { createBrowserRouter } from 'react-router';
import Home from '../../features/home/pages/Home.jsx';
import Login from '../../features/auth/pages/Login.jsx';
import Register from '../../features/auth/pages/Register.jsx';
import Protected from '../components/Protected.jsx';
import Dashboard from '../../features/stores/pages/Dashboard.jsx';

export const MainRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },

  {
    path:"/dashboard",
    element: <Protected> <Dashboard /></Protected>
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
