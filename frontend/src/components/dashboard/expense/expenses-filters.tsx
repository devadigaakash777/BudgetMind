'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setSearchText } from '@/redux/slices/daily-expenses-slice';

export function DailyExpensesFilters(): React.JSX.Element {
  const dispatch = useDispatch();
  const searchText = useSelector((state: RootState) => state.expense.searchText);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(event.target.value));
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchText}
        onChange={handleSearchChange}
        fullWidth
        placeholder="Search date or status (on budget, underspent, overspent)"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}
