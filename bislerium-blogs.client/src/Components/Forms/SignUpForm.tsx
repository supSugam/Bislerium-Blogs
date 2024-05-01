import { useEffect, useState } from 'react';
import { UserRole } from '../../enums/UserRole';
import { capitalizeFirstLetter } from '../../utils/string';
import StyledInput from '../Elements/StyledInput';
import StyledText from '../Elements/StyledText';
import ButtonWithIcon from '../Helpers/ButtonWithIcon';
import GoogleIcon from '../../lib/SVGs/GoogleIcon';
import ImageInputDisplay from '../Reusables/ImageInput';
import Dropdown from '../Reusables/Dropdown';
import { LabelInputContainer } from '../Reusables/LabelnputContainer';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
const signUpFormSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
import { useForm } from 'react-hook-form';
import { objectToFormData } from '../../utils/object';
import useAuthQuery from '../../hooks/react-query/useAuthQuery';
import { useAuthStore } from '../../services/stores/useAuthStore';
import StyledButton from '../Elements/StyledButton';

export function SignupForm({
  mode = 'signup',
}: {
  mode?: 'signup' | 'update-profile';
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<yup.InferType<typeof signUpFormSchema>>({
    resolver: yupResolver(signUpFormSchema),
    mode: 'onChange',
  });

  const { signUp } = useAuthQuery();
  const { setAuthSession, setAuthModalActiveSection } = useAuthStore();
  const onSubmit = (data: yup.InferType<typeof signUpFormSchema>) => {
    const payload = {
      ...data,
      role,
      avatar: avatar ? new File([avatar], 'avatar.png') : null,
    };
    const formData = objectToFormData(payload);
    signUp.mutate(formData);
    setAuthSession({ email: data.email, fullName: data.fullName });
  };

  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  useEffect(() => {}, []);
  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <LabelInputContainer
          htmlFor="fullName"
          label="Full Name"
          errorMessage={errors.fullName?.message}
        >
          <StyledInput
            id="fullName"
            placeholder="Sugam Subedi"
            type="text"
            {...register('fullName')}
          />
        </LabelInputContainer>
        <LabelInputContainer
          className="mb-4"
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
      </div>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <LabelInputContainer
          htmlFor="username"
          label="Username"
          errorMessage={errors.username?.message}
        >
          <StyledInput
            id="username"
            placeholder="supSugam"
            type="text"
            {...register('username')}
          />
        </LabelInputContainer>

        <LabelInputContainer htmlFor="role" label="Sign Up As">
          <Dropdown
            className="w-full"
            items={Object.values(UserRole)
              .filter((role) => role !== UserRole.ADMIN)
              .map((role) => ({
                label: capitalizeFirstLetter(role),
                onClick: () => setRole(role as UserRole),
                bordered: true,
              }))}
            targetComponent={
              <StyledInput
                value={capitalizeFirstLetter(role)}
                id="role"
                type="text"
                readOnly
              />
            }
            position="left"
            takeParentWidth
          />
        </LabelInputContainer>
      </div>

      <div className="flex flex-row space-x-6 items-center justify-between">
        <div className="flex flex-col flex-1">
          <LabelInputContainer
            className="mb-2"
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
          <LabelInputContainer
            className="mb-2"
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

        <div className="w-36 h-36">
          <ImageInputDisplay
            src={avatar}
            onChange={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                setAvatar(e.target?.result as string);
              };
              reader.readAsDataURL(file);
            }}
            onDelete={() => setAvatar(null)}
            allowDnd
            maxSize={6 * 1024 * 1024}
          />
        </div>
      </div>

      <StyledButton
        type="submit"
        text="Sign Up"
        variant="dark"
        className="mt-4"
      />
      <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-4 h-[1px] w-full" />
      {/* 
      <ButtonWithIcon
        icon={<GoogleIcon size={20} />}
        onClick={async () => {
          // await signInWithGoogle();
          // setModalOpen(false);
        }}
      >
        Continue with Google
      </ButtonWithIcon> */}

      <StyledButton
        onClick={() => setAuthModalActiveSection('login')}
        text={
          <StyledText className="text-center">
            {`Already have an account?`}{' '}
            <StyledText className="font-medium">Log In</StyledText>
          </StyledText>
        }
        variant="secondary"
        className="mt-3 w-full border-none"
      />
    </form>
  );
}
