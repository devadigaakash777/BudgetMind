'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { FixedExpenseCard } from '@/components/dashboard/bills/bill-card';
import { CompaniesFilters } from '@/components/dashboard/wishlists/integrations-filters'; 
import AddFixedExpenseModal from '@/components/dashboard/bills/bill-model';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  deleteExpense,
  payExpense,
  increaseDuration,
  decreaseDuration,
  updateBudgetState
} from '@/redux/slices/budgetSlice';

export default function FixedExpensesContent(): React.JSX.Element {
  const dispatch = useDispatch();
  const fixedExpenseWallet = useSelector((state: RootState) => state.budget.FixedExpenses);
  const fixedExpenses = fixedExpenseWallet.expenses;

  // Modal state
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddExpense = (newExpense: any) => {
    const updatedExpenses = [...fixedExpenses, newExpense];
    dispatch(updateBudgetState({
        FixedExpenses: {
            ...fixedExpenseWallet,  // keep rowsPerPage and any other fields
            expenses: updatedExpenses
        }
    }));
  };

  // Pagination state
  const [page, setPage] = React.useState(0);
  const rowsPerPage = fixedExpenseWallet.rowsPerPage;
  console.log(rowsPerPage);

  const paginatedItems = fixedExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(fixedExpenses.length / rowsPerPage);
  
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Fixed Expenses</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
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
            onClick={handleOpen}
          >
            Add
          </Button>
        </div>

        <AddFixedExpenseModal
          open={open}
          onClose={handleClose}
          onAdd={handleAddExpense}
        />
      </Stack>

      <CompaniesFilters />

      <Grid container spacing={3}>
        {paginatedItems.map((expense) => (
          <Grid
            key={expense.id}
            size={{
              lg: 4,
              md: 6,
              xs: 12,
            }}
            >
            <FixedExpenseCard
              item={expense}
              onDelete={(id) => dispatch(deleteExpense(id))}
              onPay={(id) => dispatch(payExpense(id))}
              onIncreaseDuration={(id) => dispatch(increaseDuration(id))}
              onDecreaseDuration={(id) => dispatch(decreaseDuration(id))}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          size="small"
        />
      </Box>
    </Stack>
  );
}
