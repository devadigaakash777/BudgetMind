import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { convertExpenseDueDate } from '@/utils/convert-expense-due-date';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import dayjs from 'dayjs';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  paid: { label: 'Paid', color: 'success' },
  expired: { label: 'Expired', color: 'error' },
} as const;

export interface FixedExpenses {
  id: string;
  billName: string;
  amount: number;
  dueAmount:number;
  status: 'pending' | 'paid' | 'expired';
  dueDate: number;
}

export interface FixedExpenseProps {
  expenses?: FixedExpenses[];
  sx?: SxProps;
}

export function FixedExpense({ expenses = [], sx }: FixedExpenseProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Latest orders" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Bill Name</TableCell>
              <TableCell>Bill Cost(₹)</TableCell>
              <TableCell>Saved Amount(₹)</TableCell>
              <TableCell sortDirection="desc">Due Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => {
              const { label, color } = statusMap[expense.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={expense.id}>
                  <TableCell>{expense.billName}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.amount - expense.dueAmount}</TableCell>
                  <TableCell>{convertExpenseDueDate(expense.dueDate, "toString")}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
          component={RouterLink} 
          href={paths.dashboard.bills}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
