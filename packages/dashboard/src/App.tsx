import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { useRealTimeStats } from './hooks/useAnalytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isConnected } = useRealTimeStats();

  return (
    <Layout isConnected={isConnected}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payments" element={<div>Payments Page</div>} />
        <Route path="/revenue" element={<div>Revenue Page</div>} />
        <Route path="/networks" element={<div>Networks Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
