'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setPage, setRowsPerPage } from '@/redux/slices/daily-expenses-slice';

import { DailyExpensesFilters } from '@/components/dashboard/expense/expenses-filters';
import { DailyExpensesTable } from '@/components/dashboard/expense/expenses-table';
import type { DailyExpense } from '@/types/daily-expense';

import RouterLink from 'next/link';
import { paths } from '@/paths';

export default function ExpenseContent(): React.JSX.Element {

  const dispatch = useDispatch();
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   dispatch(setRowsPerPage(Number.parseInt(event.target.value, 10)));
   dispatch(setPage(0)); // reset to first page
  };

  const expenseState = useSelector((state: RootState) => state.expense);
  const dailyExpenses = expenseState.data.map((expense) => ({
    id: expense.id,
    userId: expense.userId,
    amount: expense.amount,
    date: expense.date,
    details: expense.details,
    balance: expense.balance,
    amountStatus: expense.amountStatus as 'above' | 'equal' | 'below',
    amountDifference: expense.amountDifference,
  }));
  const page = expenseState.page;
  const rowsPerPage = expenseState.rowsPerPage;

  const paginatedDailyExpenses = applyPagination(dailyExpenses, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Daily Expenses</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button 
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} 
            variant="contained" 
            component={RouterLink} 
            href={paths.dashboard.addExpense}>
            Add
          </Button>
        </div>
      </Stack>
      <DailyExpensesFilters />
      <DailyExpensesTable
        count={dailyExpenses.length}
        page={page}
        rows={paginatedDailyExpenses}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Stack>
  );
}

function applyPagination(rows: DailyExpense[], page: number, rowsPerPage: number): DailyExpense[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
