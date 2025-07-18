'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setPage, setRowsPerPage } from '@/redux/slices/daily-expenses-slice';
import FullScreenLoader from '@/components/dashboard/loader';
import { DailyExpensesFilters } from '@/components/dashboard/expense/expenses-filters';
import { DailyExpensesTable } from '@/components/dashboard/expense/expenses-table';
import type { DailyExpense } from '@/types/daily-expense';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import { thunkDownloadExpensesExcel } from '@/redux/thunks/expense-thunks';
import { showSnackbar } from '@/redux/slices/snackbar-slice';
import DownloadExpenseCard from '@/components/dashboard/expense/download-expense-card';

const statusLabelMap = {
    above: "overspent",
    below: "underspent",
    equal: "on budget"
  };

export default function ExpenseContent(): React.JSX.Element {

  const dispatch = useDispatch<AppDispatch>();
  const [fromDate, setFromDate] = React.useState<string>('');
  const [toDate, setToDate] = React.useState<string>('');

  const handleDownloadClick = () => {
    if (!fromDate || !toDate) {
      dispatch(showSnackbar({
        message: 'Please select both from and to dates.',
        severity: 'error',
      }));
      return;
    }
    dispatch(thunkDownloadExpensesExcel({ fromDate, toDate }));
  };


  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   dispatch(setRowsPerPage(Number.parseInt(event.target.value, 10)));
   dispatch(setPage(0)); // reset to first page
  };

  const expenseState = useSelector((state: RootState) => state.expense);
  const dailyExpenses = expenseState.data.map((expense) => ({
    _id: expense._id,
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

  const searchText = expenseState.searchText.toLowerCase();
  
  const filteredDailyExpenses = React.useMemo(() => {
    return dailyExpenses.filter((expense) =>
      statusLabelMap[expense.amountStatus]?.toLowerCase().includes(searchText) ||
      expense.date?.toLowerCase().includes(searchText)
    );
  }, [dailyExpenses, searchText]);

  const paginatedDailyExpenses = React.useMemo(() => {
    return applyPagination(filteredDailyExpenses, page, rowsPerPage);
  }, [filteredDailyExpenses, page, rowsPerPage]);
    const isAppLoading = useSelector((state: RootState) => state.loader.isAppLoading);
  
  if (isAppLoading) {
    return (
      <FullScreenLoader />
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Daily Expenses</Typography>
        </Stack>
        <div>
          <Button 
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} 
            variant="contained" 
            component={RouterLink} 
            href={paths.dashboard.addExpense}>
            Add Daily Expenses
          </Button>
        </div>
      </Stack>
      <DownloadExpenseCard
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            onDownloadClick={handleDownloadClick}
      />
      <DailyExpensesFilters />
      <DailyExpensesTable
        count={filteredDailyExpenses.length}
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
