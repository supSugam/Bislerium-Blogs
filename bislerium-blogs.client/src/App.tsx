import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './services/stores/useAuthStore';
import { useEffect } from 'react';
import Layout from './Components/Layout/_layout';
import BlogPage from './pages/BlogPage/BlogPage';
import BlogEditor from './pages/BlogEditor/BlogEditor';
import BlogHistoryPage from './pages/BlogPage/BlogHistory';
function App() {
  const queryClient = new QueryClient();
  const { onInitialize } = useAuthStore();

  useEffect(() => {
    onInitialize();
  }, [onInitialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          className: 'toast-wrapper',
        }}
      />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="blogs" element={<></>} />
              <Route path="contact" element={<></>} />
            </Route>
            <Route
              path="/blog/publish"
              element={<BlogEditor mode="publish" />}
            />
            <Route
              path="/blog/update/:id"
              element={<BlogEditor mode="update" />}
            />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/blog/history/:id" element={<BlogHistoryPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
