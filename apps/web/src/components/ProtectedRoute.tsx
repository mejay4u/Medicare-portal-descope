import { useSession } from '@descope/react-sdk';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isSessionLoading } = useSession();

  if (isSessionLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f4f8',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        color: '#003461',
        fontSize: 16,
        gap: 12,
      }}>
        <span style={{
          width: 24,
          height: 24,
          border: '3px solid #d3e4ff',
          borderTopColor: '#003461',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          display: 'inline-block',
        }} />
        Loading your session…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
