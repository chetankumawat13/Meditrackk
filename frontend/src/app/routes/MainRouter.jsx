import { createBrowserRouter } from 'react-router';

import Home from '../../features/home/pages/Home.jsx';
import Login from '../../features/auth/pages/Login.jsx';
import Register from '../../features/auth/pages/Register.jsx';
import Protected from '../components/Protected.jsx';

import BuyerLayout from '../../features/buyer/layout/BuyerLayout.jsx';
import BuyerDashboard from '../../features/buyer/pages/Dashboard.jsx';
import MedicationHistory from '../../features/buyer/pages/MedicationHistory.jsx';
import SafetyAlerts from '../../features/buyer/pages/SafetyAlerts.jsx';
import Prescriptions from '../../features/buyer/pages/Prescriptions.jsx';
import ShareHistory from '../../features/buyer/pages/ShareHistory.jsx';
import BuyerReports from '../../features/buyer/pages/Reports.jsx';
import Profile from '../../features/buyer/pages/Profile.jsx';

import SellerLayout from '../../features/seller/layout/SellerLayout.jsx';
import SellerDashboard from '../../features/seller/pages/Dashboard.jsx';
import Inventory from '../../features/seller/pages/Inventory.jsx';
import AddMedicine from '../../features/seller/pages/AddMedicine.jsx';
import NewSale from '../../features/seller/pages/NewSale.jsx';
import Patients from '../../features/seller/pages/Patients.jsx';
import SalesHistory from '../../features/seller/pages/SalesHistory.jsx';
import SellerReports from '../../features/seller/pages/Reports.jsx';

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
  {
    path: '/buyer',
    element: <Protected role="patient"><BuyerLayout /></Protected>,
    children: [
      { index: true, element: <BuyerDashboard /> },
      { path: 'history', element: <MedicationHistory /> },
      { path: 'alerts', element: <SafetyAlerts /> },
      { path: 'prescriptions', element: <Prescriptions /> },
      { path: 'share', element: <ShareHistory /> },
      { path: 'reports', element: <BuyerReports /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/seller',
    element: <Protected role="store"><SellerLayout /></Protected>,
    children: [
      { index: true, element: <SellerDashboard /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'add-medicine', element: <AddMedicine /> },
      { path: 'new-sale', element: <NewSale /> },
      { path: 'patients', element: <Patients /> },
      { path: 'sales', element: <SalesHistory /> },
      { path: 'reports', element: <SellerReports /> },
    ],
  },
]);
