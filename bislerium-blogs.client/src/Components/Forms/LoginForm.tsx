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

  const { logIn } = useAuthQuery();
  const { setAuthModalActiveSection } = useAuthStore();

  const onSubmit = (data: yup.InferType<typeof loginFormSchema>) => {
    logIn.mutate(data);
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
          />
        </LabelInputContainer>
      </div>

      <StyledButton
        type="submit"
        text="Log In"
        variant="dark"
        className="mt-4"
      />

      <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-4 h-[1px] w-full" />

      <ButtonWithIcon
        icon={<GoogleIcon size={20} />}
        onClick={async () => {
          // await signInWithGoogle();
          // setModalOpen(false);
        }}
      >
        Continue with Google
      </ButtonWithIcon>
      <StyledButton
        onClick={() => setAuthModalActiveSection('signup')}
        text={
          <StyledText className="text-center">
            {`Don't have an account?`}{' '}
            <StyledText className="font-medium">Sign Up</StyledText>
          </StyledText>
        }
        variant="secondary"
        className="mt-3 w-full border-t-0 border-x-0 border-b border-b-neutral-400"
      />
    </form>
  );
}

export default LoginForm;
