/* eslint-disable @typescript-eslint/no-explicit-any */

import { isRejected } from '@reduxjs/toolkit';
import { showSnackbar } from '../slices/snackbar-slice';

export const snackbarMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // Show success snackbar for fulfilled API calls
  // if (isFulfilled(action)) {
  //   store.dispatch(
  //     showSnackbar({
  //       message: 'Action completed successfully.',
  //       severity: 'success',
  //     })
  //   );
  // }

  // Show error snackbar for rejected API calls
  if (isRejected(action)) {
    store.dispatch(
      showSnackbar({
        message: 'Something went wrong. Please try again',
        severity: 'error',
      })
    );
  }

  return result;
};
