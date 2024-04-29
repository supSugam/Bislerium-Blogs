import React from 'react';
import Navbar from './Navbar';
import AuthModal from '../Modal/AuthModal';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <AuthModal />
    </>
  );
};

export default Layout;
