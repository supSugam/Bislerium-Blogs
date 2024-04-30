import { useMemo, useState } from 'react';
import { useAuthStore } from '../../services/stores/useAuthStore';
import Modal from './Modal';
import { SignupForm } from '../Forms/SignUpForm';
import OTPVerification from '../OTPVerification';
import { motion } from 'framer-motion';
import LoginForm from '../Forms/LoginForm';
import useAuthQuery from '../../hooks/react-query/useAuthQuery';

const AuthModal = () => {
  const { authModalOpen, closeAuthModal, authSession, authModalActiveSection } =
    useAuthStore();
  const [otpCode, setOtpCode] = useState<number>();

  const sectionTitle = useMemo(() => {
    if (authModalActiveSection === 'signup') {
      return 'Join Bislerium Blogs.';
    } else if (authModalActiveSection === 'login') {
      return 'Welcome back.';
    } else if (authModalActiveSection === 'verify-otp') {
      return 'Verify OTP';
    }
  }, [authModalActiveSection]);

  const { verifyOtp, resendOtp } = useAuthQuery();

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      className="flex flex-col sm:w-10/12 xl:max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input border"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="font-serif tracking-[-0.03em] text-[28px] text-center"
        key={sectionTitle}
      >
        {sectionTitle}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="flex flex-col items-center w-full mt-6"
        key={authModalActiveSection}
      >
        {
          {
            signup: <SignupForm />,
            login: <LoginForm />,
            'verify-otp': (
              <OTPVerification
                code={otpCode}
                onCodeChange={(code) => setOtpCode(code)}
                sentTo={authSession.email ?? 'Your email'}
                onVerify={async () => {
                  if (!authSession.email || !otpCode) return;
                  await verifyOtp.mutateAsync(
                    { otp: otpCode, email: authSession.email },
                    {
                      onError: () => {
                        setOtpCode(undefined);
                      },
                    }
                  );
                }}
                onResend={async () => {
                  if (!authSession.email) return;
                  await resendOtp.mutateAsync(
                    {
                      email: authSession.email,
                      fullName: authSession.fullName || 'User',
                    },
                    {
                      onError: () => {
                        setOtpCode(undefined);
                      },
                    }
                  );
                }}
                resendInterval={60}
              />
            ),
          }[authModalActiveSection]
        }
      </motion.div>
      {/* <SignupForm /> */}
    </Modal>
  );
};

export default AuthModal;
