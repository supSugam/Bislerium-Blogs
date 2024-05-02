import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../services/stores/useAuthStore';
import Modal from './Modal';
import { SignupForm } from '../Forms/SignUpForm';
import OTPVerification from '../OTPVerification';
import { motion } from 'framer-motion';
import LoginForm from '../Forms/LoginForm';
import useAuthQuery from '../../hooks/react-query/useAuthQuery';
import ResetPassword from '../Forms/ResetPassword';
import { nameFromEmail } from '../../utils/string';

const AuthModal = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authSession,
    authModalActiveSection,
    passwordSession,
  } = useAuthStore();
  const [otpCode, setOtpCode] = useState<number>();

  const sectionTitle = useMemo(() => {
    let title = '';
    switch (authModalActiveSection) {
      case 'signup':
        title = 'Join Bislerium Blogs.';
        break;
      case 'login':
        title = 'Welcome back.';
        break;
      case 'verify-account':
        title = 'Verify Account';
        break;
      case 'update-profile':
        title = 'Update Profile';
        break;
      case 'reset-password':
        title = 'Reset Password';
        break;
      case 'verify-reset-password':
        title = 'Verify Reset Password OTP';
        break;
      default:
        title = '';
        break;
    }
    return title;
  }, [authModalActiveSection]);

  const { verifyOtp, sendOtp, resetPassword } = useAuthQuery();

  useEffect(() => {
    setOtpCode(undefined);
  }, [authModalActiveSection]);

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
            signup: <SignupForm mode="signup" />,
            login: <LoginForm />,
            'reset-password': <ResetPassword />,
            'update-profile': <SignupForm mode="update-profile" />,
            'verify-reset-password': (
              <OTPVerification
                code={otpCode}
                isPending={resetPassword.isPending}
                onCodeChange={(code) => setOtpCode(code)}
                sentTo={authSession.email ?? 'Your email'}
                onVerify={async () => {
                  if (!passwordSession?.email || !otpCode) return;
                  await resetPassword.mutateAsync(
                    {
                      otp: otpCode,
                      email: passwordSession.email,
                      password: passwordSession.password,
                    },
                    {
                      onError: () => {
                        setOtpCode(undefined);
                      },
                    }
                  );
                }}
                onResend={async () => {
                  if (!authSession.email) return;
                  await sendOtp.mutateAsync(
                    {
                      email: passwordSession?.email || 'Email',
                      fullName: nameFromEmail(
                        passwordSession?.email || 'Email'
                      ),
                      subject: 'Verify Reset Password (Resend)',
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
            'verify-account': (
              <OTPVerification
                code={otpCode}
                isPending={verifyOtp.isPending}
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
                  await sendOtp.mutateAsync(
                    {
                      email: authSession.email,
                      fullName: authSession.fullName || authSession.email,
                      subject: 'Verify Account',
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
