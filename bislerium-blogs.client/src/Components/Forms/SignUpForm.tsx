import { useEffect, useState } from 'react';
import { UserRole } from '../../enums/UserRole';
import { capitalizeFirstLetter } from '../../utils/string';
import StyledInput from '../Elements/StyledInput';
import StyledText from '../Elements/StyledText';
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
import useUsersQuery from '../../hooks/react-query/useUsersQuery';
import ButtonWithIcon from '../Helpers/ButtonWithIcon';
import GoogleIcon from '../../lib/SVGs/GoogleIcon';
import toast from 'react-hot-toast';

export function SignupForm({
  mode = 'signup',
}: {
  mode?: 'signup' | 'update-profile';
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<yup.InferType<typeof signUpFormSchema>>({
    resolver: yupResolver(signUpFormSchema),
    mode: 'onChange',
  });

  const {
    signUp: { isPending: isSignupPending, mutate: signUpMutation },
  } = useAuthQuery();

  const {
    updateMe: {
      isPending: isUpdateProfilePending,
      mutate: updateProfileMutation,
    },
  } = useUsersQuery();
  const { setAuthSession, setAuthModalActiveSection } = useAuthStore();

  const isPending = isSignupPending || isUpdateProfilePending;
  // On Submit
  const onSubmit = (data: yup.InferType<typeof signUpFormSchema>) => {
    if (mode === 'signup') {
      const payload = {
        ...data,
        role,
        avatar,
      };
      const formData = objectToFormData(payload);
      signUpMutation(formData);
      setAuthSession({ email: data.email, fullName: data.fullName });
    } else {
      const payload = {
        ...(currentUser?.role !== role && { role }),
        ...(avatar && { avatar }),
        deleteAvatar: !avatar && !currentAvatar,
        ...(data.fullName !== currentUser?.fullName && {
          fullName: data.fullName,
        }),
        ...(data.email !== currentUser?.email && { email: data.email }),
      };
      const formData = objectToFormData(payload);
      updateProfileMutation(formData);
    }
  };

  const [avatar, setAvatar] = useState<File | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  const { currentUser } = useAuthStore();
  const [role, setRole] = useState<UserRole>(
    currentUser?.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.BLOGGER
  );
  useEffect(() => {
    if (mode === 'update-profile' && currentUser) {
      setRole(currentUser.role ?? UserRole.USER);
      setAvatar(null);
      setCurrentAvatar(currentUser.avatarUrl);
      setValue('fullName', currentUser.fullName);
      setValue('email', currentUser.email);
      setValue('username', currentUser.username);
      setValue('password', 'Pa$$w0rd');
      setValue('confirmPassword', 'Pa$$w0rd');
    }
  }, [mode, currentUser, setValue]);
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
            disabled={isPending}
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
            disabled={isPending || mode === 'update-profile'}
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
            disabled={isPending}
          />
        </LabelInputContainer>

        <LabelInputContainer htmlFor="role" label="Sign Up As">
          <Dropdown
            className="w-full"
            items={
              currentUser?.role === UserRole.ADMIN
                ? [
                    {
                      label: capitalizeFirstLetter(role),
                      onClick: () => setRole(UserRole.ADMIN),
                      bordered: true,
                    },
                  ]
                : [
                    {
                      label: capitalizeFirstLetter(UserRole.BLOGGER),
                      onClick: () => setRole(UserRole.BLOGGER),
                      bordered: true,
                    },
                  ]
            }
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
              disabled={isPending || mode === 'update-profile'}
              readOnly={mode === 'update-profile'}
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
              disabled={isPending || mode === 'update-profile'}
              readOnly={mode === 'update-profile'}
            />
          </LabelInputContainer>
        </div>

        <div className="w-36 h-36">
          <ImageInputDisplay
            src={avatar ? URL.createObjectURL(avatar) : currentAvatar}
            onChange={(file) => {
              if (file) setAvatar(file);
            }}
            onDelete={() => {
              setAvatar(null);
              setCurrentAvatar(null);
            }}
            allowDnd
            maxSize={6 * 1024 * 1024}
            disabled={isPending}
          />
        </div>
      </div>

      <StyledButton
        type="submit"
        text={mode === 'update-profile' ? 'Update Profile' : 'Sign Up'}
        variant="dark"
        isLoading={isPending}
      />
      <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-4 h-[1px] w-full" />

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
