import React, { Suspense, lazy } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import AdminLayout from '../layouts/AdminLayout';
import AnimatedPage from '../components/common/AnimatedPage';

// Lazy-loaded pages
const HomePage = lazy(() => import('../pages/HomePage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const TopupPage = lazy(() => import('../pages/TopupPage'));
const NewsListPage = lazy(() => import('../pages/NewsListPage'));
const NewsDetailPage = lazy(() => import('../pages/NewsDetailPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

// Lazy-loaded admin modules
const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard'));
const AdminAccount = lazy(() => import('../features/admin/components/AdminAccount'));
const AdminCoin = lazy(() => import('../features/admin/components/AdminCoin'));
const AdminGiftcode = lazy(() => import('../features/admin/components/AdminGiftcode'));
const AdminNews = lazy(() => import('../features/admin/components/AdminNews'));
const AdminBanking = lazy(() => import('../features/admin/components/AdminBanking'));
const AdminItems = lazy(() => import('../features/admin/components/AdminItems'));
const AdminLogs = lazy(() => import('../features/admin/components/AdminLogs'));
const AdminAuction = lazy(() => import('../features/admin/components/AdminAuction'));

const PageSuspense = ({ children }) => (
  <Suspense
    fallback={
      <div className="game-page-loading">
        <div className="anchor-spinner">⚓</div>
        <p>Đang tải dữ liệu Đại Hải Trình...</p>
      </div>
    }
  >
    {children}
  </Suspense>
);

export const routes = [
  { path: '/', element: <PageSuspense><HomePage /></PageSuspense> },
  { path: '/tai-khoan', element: <PageSuspense><AccountPage /></PageSuspense> },
  { path: '/nap-tien', element: <PageSuspense><TopupPage /></PageSuspense> },
  { path: '/news', element: <PageSuspense><NewsListPage /></PageSuspense> },
  { path: '/news/:idOrSlug', element: <PageSuspense><NewsDetailPage /></PageSuspense> },
  { path: '/login', element: <PageSuspense><LoginPage /></PageSuspense> },
  { path: '/register', element: <PageSuspense><RegisterPage /></PageSuspense> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <PageSuspense><AdminDashboard /></PageSuspense> },
      { path: 'accounts', element: <PageSuspense><AdminAccount /></PageSuspense> },
      { path: 'coins', element: <PageSuspense><AdminCoin /></PageSuspense> },
      { path: 'giftcodes', element: <PageSuspense><AdminGiftcode /></PageSuspense> },
      { path: 'news', element: <PageSuspense><AdminNews /></PageSuspense> },
      { path: 'items', element: <PageSuspense><AdminItems /></PageSuspense> },
      { path: 'banking', element: <PageSuspense><AdminBanking /></PageSuspense> },
      { path: 'logs', element: <PageSuspense><AdminLogs /></PageSuspense> },
      { path: 'auctions', element: <PageSuspense><AdminAuction /></PageSuspense> },
    ],
  },
];

export default function AppRoutes() {
  const location = useLocation();
  const element = useRoutes(routes, location);

  // Stable key for admin sub-routes to keep AdminLayout mounted
  const animatedKey = location.pathname.startsWith('/admin') ? '/admin' : location.pathname;

  return (
    <AnimatePresence mode="wait">
      {element && (
        <AnimatedPage key={animatedKey}>
          {element}
        </AnimatedPage>
      )}
    </AnimatePresence>
  );
}
