'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useDispatch } from 'react-redux';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { setUser, setAccessToken } from '@/redux/slices/user-slice';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const [loginEmail, setLoginEmail] = React.useState<string>('');
  const [resendStatus, setResendStatus] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setLoginEmail(values.email); // Store attempted email
      setResendStatus(null);       // Clear previous status

      const res = await authClient.signInWithPassword(values);

      if (res.error) {
        setError('root', { type: 'server', message: res.error });
        setIsPending(false);
        return;
      }

      dispatch(setUser(res.data!));
      dispatch(setAccessToken(res.accessToken!));
      router.refresh();
    },
    [dispatch, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  endAdornment={
                    showPassword ? (
                      <EyeIcon cursor="pointer" onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeSlashIcon cursor="pointer" onClick={() => setShowPassword(true)} />
                    )
                  }
                />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          {errors.root && (
            <>
              <Alert color="error">{errors.root.message}</Alert>
              {errors.root.message === 'Please verify your email before logging in.' && (
                <Button
                  variant="outlined"
                  onClick={async () => {
                    try {
                      const res = await authClient.resendVerification(loginEmail);
                      if (res?.error) {
                        setResendStatus(res.error);
                      } else {
                        setResendStatus('Verification email has been resent. Please check your inbox.');
                      }
                    } catch {
                      setResendStatus('Something went wrong while resending verification email.');
                    }
                  }}
                >
                  Resend Verification Email
                </Button>
              )}
            </>
          )}

          {resendStatus && <Alert color="info">{resendStatus}</Alert>}

          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
