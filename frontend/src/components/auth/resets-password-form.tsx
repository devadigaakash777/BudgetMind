'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { z as zod } from 'zod';

import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  newPassword: zod.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: zod.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Values = zod.infer<typeof schema>;

const defaultValues = { newPassword: '', confirmPassword: '' } satisfies Values;

export function ResetPasswordForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const router = useRouter();
  const { token } = useParams(); // Get token from URL

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const result = await authClient.resetPassword(token as string, values.newPassword);

      if (result.error) {
        setErrorMessage(result.error);
        setIsPending(false);
        return;
      }

      setSuccessMessage(" Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push('/auth/sign-in'); // Redirect to login page
      }, 2000);
    },
    [token, router]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Set a New Password</Typography>
      {successMessage && (
        <Alert severity="success" color="success">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" color="error">
          {errorMessage}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.newPassword)}>
                <InputLabel>New Password</InputLabel>
                <OutlinedInput {...field} label="New Password" type="password" />
                {errors.newPassword ? <FormHelperText>{errors.newPassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput {...field} label="Confirm Password" type="password" />
                {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
