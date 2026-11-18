import { useEffect } from 'react';
import './App.css';
import ServicesLayout from './services-page/services-layout';
import SalonLogin from './login/salonLogin';
import { Routes, Route, Navigate } from 'react-router-dom';
import CheckoutLayout from './checkout/checout-layout';
import DashboardLayout from './dashboard/dashboard-layout';
import RegisterSalon from './registration/register-salon';
import BookingsLayout from './bookings/bookings-layout';
import NotFoundLayout from './not-found/not-found-layout';
import RoleProtectedRoute from './components/role-protected-route';
import Unauthorized from './pages/unauthorized';
import { useAuthStore } from './stores/auth-store';

/**
 * Helper to smartly redirect legacy /salon/dashboard to :salonName/dashboard
 */
function DashboardRedirect() {
  const user = useAuthStore((state) => state.user);
  const targetSlug = user?.salonSlug || 'spafy';
  return <Navigate to={`/${targetSlug}/dashboard`} replace />;
}

/**
 * Root Route handler redirecting authenticated users to their authorized workspace
 */
function RootRoute() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || !user) {
    return <SalonLogin />;
  }

  const role = user.role === 'owner' ? 'salon' : user.role;
  if (role === 'salon') {
    return <Navigate to={`/${user.salonSlug || 'spafy'}/dashboard`} replace />;
  }
  return <Navigate to="/salon/spafy" replace />;
}

function App() {
  const initAuthFromUrl = useAuthStore((state) => state.initAuthFromUrl);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    initAuthFromUrl();
    checkAuth();
  }, [initAuthFromUrl, checkAuth]);

  return (
    <>
      <Routes>
        {/* Public & Login Routes */}
        <Route path='/' element={<RootRoute />} />
        <Route path='/salon/login' element={<SalonLogin />} />

        {/* 
          ROLE: SALON (and ADMIN)
          Path: salonName/dashboard (e.g. /spafy/dashboard)
          Salon partners can only access the salon dashboard.
        */}
        <Route
          path='/:salonName/dashboard'
          element={
            <RoleProtectedRoute allowedRoles={['salon', 'admin']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='/salon/:salonName/dashboard'
          element={
            <RoleProtectedRoute allowedRoles={['salon', 'admin']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }
        />
        <Route path='/salon/dashboard' element={<DashboardRedirect />} />

        {/* 
          ROLE: USER (and ADMIN)
          User can only access salon pages, bookings, profile, checkout page.
          Salon partners attempting to access these client routes are blocked.
        */}
        <Route
          path='/salon/bookings'
          element={
            <RoleProtectedRoute allowedRoles={['user', 'admin']}>
              <BookingsLayout />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='/bookings'
          element={
            <RoleProtectedRoute allowedRoles={['user', 'admin']}>
              <BookingsLayout />
            </RoleProtectedRoute>
          }
        />

        <Route
          path='/salon/checkout'
          element={
            <RoleProtectedRoute allowedRoles={['user', 'admin']}>
              <CheckoutLayout />
            </RoleProtectedRoute>
          }
        />

        {/* Salon Partner Registration */}
        <Route
          path='/salon/register'
          element={
            <RoleProtectedRoute allowedRoles={['salon', 'admin']} allowPublic={true}>
              <RegisterSalon />
            </RoleProtectedRoute>
          }
        />

        <Route
          path='/salon/:name'
          element={
            <RoleProtectedRoute allowedRoles={['user', 'admin']} allowPublic={true}>
              <ServicesLayout />
            </RoleProtectedRoute>
          }
        />

        {/* Access Denied (403) & 404 Pages */}
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/404' element={<NotFoundLayout />} />
        <Route path='/salon-not-found' element={<NotFoundLayout />} />
        <Route path='*' element={<NotFoundLayout />} />
      </Routes>
    </>
  );
}

export default App;
