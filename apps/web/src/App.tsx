import { Outlet, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import ChatFab from './components/ChatFab';

export default function App() {
  const location = useLocation();
  // Is this a Tailwind route or Vanilla CSS dashboard route?
  // Our dashboard maintains Vanilla CSS with dark themes and specific backgrounds
  const isDashboard = location.pathname === '/';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: isDashboard ? 'transparent' : '#f8f9fa' }}>
      <TopNav />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <ChatFab />
    </div>
  );
}
