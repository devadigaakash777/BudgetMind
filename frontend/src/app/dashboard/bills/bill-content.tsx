'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { FixedExpenseCard } from '@/components/dashboard/bills/bill-card';
import AddFixedExpenseModal from '@/components/dashboard/bills/bill-model';
import { ExpenseBase } from '@/types/budget'
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  thunkDeleteFixedExpense,
  thunkPayFixedExpense,
  thunkIncreaseDuration,
  thunkDecreaseDuration,
  thunkAddFixedExpense
} from '@/redux/thunks/budget-thunks';
import FullScreenLoader from '@/components/dashboard/loader';
import { useEffect } from 'react';
import { clearPreview } from '@/redux/slices/preview-slice';
import { Divider } from '@mui/material';

export default function FixedExpensesContent(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const fixedExpenseWallet = useSelector((state: RootState) => state.budget.FixedExpenses);
  const fixedExpenses = fixedExpenseWallet.expenses;

  

  //clear the preview to reflect any changes happened in this component
    useEffect(() => {
      dispatch(clearPreview());
    }, [dispatch]);

  // Modal state
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddExpense = (newExpense: ExpenseBase) => {
     dispatch(thunkAddFixedExpense(newExpense));
  };

  // Pagination state
  const [page, setPage] = React.useState(0);
  const rowsPerPage = fixedExpenseWallet.rowsPerPage;

  const sortedFixedExpenses = [...fixedExpenses].sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const paginatedItems = sortedFixedExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const totalPages = Math.ceil(fixedExpenses.length / rowsPerPage);
  
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
          <Typography variant="h4">Fixed Expenses</Typography>
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

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        {paginatedItems.map((expense) => (
          <Grid
            key={expense._id}
            size={{
              lg: 4,
              md: 6,
              xs: 12,
            }}
            >
            <FixedExpenseCard
              item={expense}
              onDelete={(id) => dispatch(thunkDeleteFixedExpense(id))}
              onPay={(id, preference, reduceDailyBudget) =>
                dispatch(thunkPayFixedExpense({ id, preference, reduceDailyBudget }))
              }
              onIncreaseDuration={(id) => dispatch(thunkIncreaseDuration(id))}
              onDecreaseDuration={(id) => dispatch(thunkDecreaseDuration(id))}
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
