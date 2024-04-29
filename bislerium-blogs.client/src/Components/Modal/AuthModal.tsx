import { useState } from 'react';
import { useAuthStore } from '../../services/stores/useAuthStore';
import Modal from './Modal';
import { SignupForm } from '../Forms/SignUpForm';

const AuthModal = () => {
  const { authModalOpen, closeAuthModal } = useAuthStore();
  const [isSignUpPage, setIsSignUpPage] = useState<boolean>(true);
  return (
    <Modal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      className="flex flex-col sm:w-10/12 xl:max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border"
    >
      <h2 className="font-serif tracking-[-0.03em] text-[28px]">
        {isSignUpPage ? 'Join Bislerium Blogs.' : 'Welcome back.'}
      </h2>
      <SignupForm />
    </Modal>
  );
};

export default AuthModal;
