import { useState, FormEvent } from 'react';
import { useAuthStore } from '../../services/stores/useAuthStore';
import Modal from './Modal';
import StyledLabel from '../Elements/StyledLabel';
import StyledInput from '../Elements/StyledInput';
import GoogleIcon from '../../lib/SVGs/GoogleIcon';

const AuthModal = () => {
  const { authModalOpen, closeAuthModal } = useAuthStore();
  const [isSignUpPage, setIsSignUpPage] = useState<boolean>(false);
  return (
    <Modal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      className="flex flex-col"
    >
      <div className="grid place-items-center py-10 px-14 text-center max-w-[678px] max-h-[695px] w-full h-full animate-fade-scale-in">
        <h2 className="font-serif tracking-[-0.03em] text-[28px]">
          {isSignUpPage ? 'Join Bislerium Blogs.' : 'Welcome back.'}
        </h2>
        <SignupForm />
      </div>
    </Modal>
  );
};

export default AuthModal;

export function SignupForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Bislerium Blogs
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Create an account to start writing and sharing your thoughts with the
        world.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <StyledLabel htmlFor="firstname">First name</StyledLabel>
            <StyledInput id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <StyledLabel htmlFor="lastname">Last name</StyledLabel>
            <StyledInput id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <StyledLabel htmlFor="email">Email Address</StyledLabel>
          <StyledInput
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <StyledLabel htmlFor="password">Password</StyledLabel>
          <StyledInput id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <StyledLabel htmlFor="twitterpassword">
            Your twitter password
          </StyledLabel>
          <StyledInput
            id="twitterpassword"
            placeholder="••••••••"
            type="twitterpassword"
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <GoogleIcon size={24} />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  );
};
