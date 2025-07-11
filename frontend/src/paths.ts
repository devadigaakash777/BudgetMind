export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    expenses: '/dashboard/expense',
    wishlists: '/dashboard/wishlists',
    bills: '/dashboard/bills',
    addExpense: '/dashboard/add-expense',
    chatbot: '/dashboard/chatbot',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
