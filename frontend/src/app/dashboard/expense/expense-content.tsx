'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setPage, setRowsPerPage } from '@/redux/slices/daily-expenses-slice';
import FullScreenLoader from '@/components/dashboard/loader';
import { DailyExpensesFilters } from '@/components/dashboard/expense/expenses-filters';
import { DailyExpensesTable } from '@/components/dashboard/expense/expenses-table';
import type { DailyExpense } from '@/types/daily-expense';

import RouterLink from 'next/link';
import { paths } from '@/paths';
import { Chip, FormControl, InputLabel, OutlinedInput, TextField, Tooltip } from '@mui/material';
import { thunkDownloadExpensesExcel } from '@/redux/thunks/expense-thunks';
import { FileXlsIcon } from '@phosphor-icons/react';
import { showSnackbar } from '@/redux/slices/snackbar-slice';

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
  const statusLabelMap = {
    above: "overspent",
    below: "underspent",
    equal: "on budget"
  };

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
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel shrink htmlFor="from-date">From Date</InputLabel>
              <OutlinedInput
                id="from-date"
                type="date"
                notched
                label="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel shrink htmlFor="to-date">To Date</InputLabel>
              <OutlinedInput
                id="to-date"
                type="date"
                notched
                label="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </FormControl>
            <Tooltip title="Download in Excel Format">
              <Chip variant="filled" onClick={handleDownloadClick} color="success" icon={<FileXlsIcon size={20} />} label="Download Excel" />
            </Tooltip>
          </Stack>
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
