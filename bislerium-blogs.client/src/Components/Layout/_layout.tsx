import React from 'react';
import Navbar from './Navbar';
import AuthModal from '../Modal/AuthModal';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col">{children}</div>
      <AuthModal />
    </>
  );
};

export default Layout;
