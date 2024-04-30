import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './services/stores/useAuthStore';
import { useEffect } from 'react';
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
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
            <Route path="blogs" element={<></>} />
            <Route path="contact" element={<></>} />
            <Route path="*" element={<></>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
