import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './services/stores/useAuthStore';
import { useEffect } from 'react';
import WriteBlog from './pages/WriteBlog';
import Layout from './Components/Layout/_layout';
function App() {
  const queryClient = new QueryClient();
  const { onInitialize } = useAuthStore();

  useEffect(() => {
    onInitialize();
  }, [onInitialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="blogs" element={<></>} />
              <Route path="contact" element={<></>} />
            </Route>
            <Route path="/write" element={<WriteBlog />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
