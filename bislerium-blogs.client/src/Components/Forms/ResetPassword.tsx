import StyledInput from '../Elements/StyledInput';
import { LabelInputContainer } from '../Reusables/LabelnputContainer';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useAuthQuery from '../../hooks/react-query/useAuthQuery';
import StyledButton from '../Elements/StyledButton';
import { useAuthStore } from '../../services/stores/useAuthStore';
import StyledText from '../Elements/StyledText';
import { nameFromEmail } from '../../utils/string';
import { useEffect } from 'react';

const resetPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<yup.InferType<typeof resetPasswordSchema>>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const { sendOtp } = useAuthQuery();
  const {
    setAuthModalActiveSection,
    isApiAuthorized,
    setPasswordSession,
    currentUser,
  } = useAuthStore();

  const onSubmit = async (data: yup.InferType<typeof resetPasswordSchema>) => {
    await sendOtp.mutateAsync(
      {
        email: currentUser?.email || data.email,
        fullName: nameFromEmail(currentUser?.email || data.email),
        subject: 'Verify Reset Password',
      },
      {
        onSuccess: () => {
          setAuthModalActiveSection('verify-reset-password');
        },
      }
    );
    setPasswordSession({ email: data.email, password: data.password });
  };

  useEffect(() => {
    if (currentUser) {
      setValue('email', currentUser.email);
    }
  }, [currentUser, setValue]);

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
            disabled={!!currentUser}
          />
        </LabelInputContainer>

        <LabelInputContainer
          className="mb-4"
          htmlFor="password"
          label="New Password"
          errorMessage={errors.password?.message}
        >
          <StyledInput
            id="password"
            placeholder="••••••••"
            type="password"
            {...register('password')}
          />
        </LabelInputContainer>
        <LabelInputContainer
          className="mb-4"
          htmlFor="confirmPassword"
          label="Confirm Password"
          errorMessage={errors.confirmPassword?.message}
        >
          <StyledInput
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            {...register('confirmPassword')}
          />
        </LabelInputContainer>
      </div>

      <StyledButton
        type="submit"
        text="Reset Password"
        variant="dark"
        className="mt-4"
      />
      {!currentUser && (
        <>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-4 h-[1px] w-full" />

          <StyledButton
            onClick={() => setAuthModalActiveSection('login')}
            text={
              <StyledText className="text-center">
                {`Cancel Password Reset? `}
                <StyledText className="font-medium text-blue-500">
                  Log In
                </StyledText>
              </StyledText>
            }
            variant="secondary"
            className="w-full border-none p-0"
          />
        </>
      )}
    </form>
  );
}

export default ResetPassword;
