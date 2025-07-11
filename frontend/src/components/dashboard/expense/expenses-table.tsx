'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react/dist/ssr';
import { useSelection } from '@/hooks/use-selection';
import type { DailyExpense } from '@/types/daily-expense';
import { Typography } from '@mui/material';

function noop(_event: unknown, _newPage: number) {}


const statusMap = {
  equal: { label: 'on budget', color: 'warning'},
  below: { label: 'underspent', color: 'success' },
  above: { label: 'overspent', color: 'error' },
} as const;

interface DailyExpensesTableProps {
  count?: number;
  page?: number;
  rows?: DailyExpense[];
  rowsPerPage?: number;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DailyExpensesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange = noop,
  onRowsPerPageChange = () => {},
}: DailyExpensesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((dailyExpenses) => dailyExpenses._id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  console.warn(selected);
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const selectedAmountTotal = React.useMemo(() => {
    return rows
      .filter((row) => selected?.has(row._id))
      .reduce((sum, row) => sum + row.amount, 0);
  }, [rows, selected]);


  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Amount Spent(₹)</TableCell>
              <TableCell>Amount Status</TableCell>
              <TableCell>Amount Difference(₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const { label, color } = statusMap[row.amountStatus] ?? { label: 'Unknown', color: 'default' };
              const isSelected = selected?.has(row._id);

              return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row._id);
                        } else {
                          deselectOne(row._id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.details}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" sx={{}}/>
                  </TableCell>
                  <TableCell>
                    {color == 'success' && <ArrowDownIcon weight='bold' fill='green' />}
                    {color == 'error' && <ArrowUpIcon weight='bold' fill='red' />}
                    {row.amountDifference}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1">
          Total Spent on Selected: ₹{selectedAmountTotal}
        </Typography>
      </Box>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
