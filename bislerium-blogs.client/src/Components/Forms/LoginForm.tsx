import StyledInput from '../Elements/StyledInput';
import ButtonWithIcon from '../Helpers/ButtonWithIcon';
import GoogleIcon from '../../lib/SVGs/GoogleIcon';
import { LabelInputContainer } from '../Reusables/LabelnputContainer';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import useAuthQuery from '../../hooks/react-query/useAuthQuery';
import StyledButton from '../Elements/StyledButton';
import { useAuthStore } from '../../services/stores/useAuthStore';
import StyledText from '../Elements/StyledText';
import toast from 'react-hot-toast';

const loginFormSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<yup.InferType<typeof loginFormSchema>>({
    resolver: yupResolver(loginFormSchema),
    mode: 'onChange',
  });

  const {
    logIn: { mutate: loginMutation, isPending },
  } = useAuthQuery();
  const { setAuthModalActiveSection, currentUser } = useAuthStore();
  const onSubmit = (data: yup.InferType<typeof loginFormSchema>) => {
    loginMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col space-y-1 w-full">
        <LabelInputContainer
          htmlFor="email"
          label="Email Address"
          errorMessage={errors.email?.message}
        >
          <StyledInput
            id="email"
            placeholder="sugam.subedi@example.com"
            type="email"
            {...register('email')}
            disabled={isPending}
          />
        </LabelInputContainer>

        <LabelInputContainer
          className="mb-4"
          htmlFor="password"
          label="Password"
          errorMessage={errors.password?.message}
        >
          <StyledInput
            id="password"
            placeholder="••••••••"
            type="password"
            {...register('password')}
            disabled={isPending}
          />
          <StyledText
            onClick={() => {
              if (isPending) return;
              setAuthModalActiveSection('reset-password');
            }}
            className="text-right text-xs mt-1 text-blue-700 cursor-pointer"
          >
            Forgot Password?
          </StyledText>
        </LabelInputContainer>
      </div>

      <StyledButton
        type="submit"
        text="Log In"
        variant="dark"
        className="mt-4"
        isLoading={isPending}
      />

      {!currentUser && (
        <>
          <ButtonWithIcon
            icon={<GoogleIcon size={20} />}
            onClick={(e) => {
              e.preventDefault();
              toast('Coming Soon, Uhh Maybe?', {
                icon: '🤷‍♂️',
              });
            }}
          >
            Continue with Google
          </ButtonWithIcon>
          <StyledButton
            onClick={() => {
              if (isPending) return;
              setAuthModalActiveSection('signup');
            }}
            text={
              <StyledText className="text-center">
                {`Don't have an account?`}{' '}
                <StyledText className="font-medium">Sign Up</StyledText>
              </StyledText>
            }
            variant="secondary"
            className="mt-3 w-full border-none"
          />
        </>
      )}
      <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-4 h-[1px] w-full" />
    </form>
  );
}

export default LoginForm;
