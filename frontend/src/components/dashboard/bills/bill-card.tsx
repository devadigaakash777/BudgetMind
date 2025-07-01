import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button, ButtonGroup, Chip } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { convertExpenseDueDate } from '@/utils/convert-expense-due-date'
import { CheckCircleIcon, XCircleIcon, TrashIcon, CalendarIcon, MoneyIcon } from '@phosphor-icons/react/dist/ssr';

const statusMap = {
  "pending": { label: 'Pending', color: 'warning' },
  "paid": { label: 'Paid', color: 'success' },
  "expired": { label: 'Expired', color: 'error' },
} as const;


export interface FixedExpenseItem {
  _id: string;
  billName: string;
  status: string;
  dueDate: number;
  isPaid: boolean;
  amount: number;
  isPermanent: boolean;
  isFunded: boolean;
  durationInMonths: number;
  amountToFund: number;
}

export interface FixedExpenseCardProps {
  item: FixedExpenseItem;
  onDelete: (id: string) => void;
  onPay: (id: string) => void;
  onIncreaseDuration: (id: string) => void;
  onDecreaseDuration: (id: string) => void;
}

export function FixedExpenseCard({
  item,
  onDelete,
  onPay,
  onIncreaseDuration,
  onDecreaseDuration
}: FixedExpenseCardProps): React.JSX.Element {
  const { label, color } = statusMap[item.status as keyof typeof statusMap] ?? { label: 'Unknown', color: 'default' };
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 1 }}>
      {/* Row 1: Icon + Main Info */}
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        {/* Avatar Icon */}
        <Avatar sx={{ width: 80, height: 80, borderRadius: 1, bgcolor: 'primary.main', color: 'white' }}>
          <MoneyIcon size={40} />
        </Avatar>

        {/* Main Content */}
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {item.billName}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
            <Typography variant="body2">Amount: ₹{item.amount}</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon size={16} style={{ marginRight: 4 }} />
              Due: { convertExpenseDueDate(item.dueDate, "toString") }
            </Typography>
            {/* Only show Change Duration if not permanent */}
            {!item.isPermanent && (
              <Typography variant="body2">
                Duration: {item.durationInMonths} months
              </Typography>
            )}
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              {item.isFunded ? (
                <>
                  <CheckCircleIcon size={16} color="green" style={{ marginRight: 4 }} />
                  Funded
                </>
              ) : (
                <>
                  <XCircleIcon size={16} color="red" style={{ marginRight: 4 }} />
                  Not Funded
                </>
              )}
            </Typography>
            <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip color={color} label={label} size="small" />
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Row 2: Action Buttons */}
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Tooltip title="Delete Expense">
          <IconButton color="error" onClick={() => onDelete(item._id)}>
            <TrashIcon size={20} />
          </IconButton>
        </Tooltip>

        {/* Only show Change Duration if not permanent */}
        {!item.isPermanent && (
          <Tooltip title="Change Duration">
            <ButtonGroup disableElevation variant="outlined" aria-label="duration button group">
              <Button onClick={() => onDecreaseDuration(item._id)}>-</Button>
              <Button onClick={() => onIncreaseDuration(item._id)}>+</Button>
            </ButtonGroup>
          </Tooltip>
        )}

        <Tooltip title={item.isFunded && !item.isPaid ? 'Pay Bill' : item.isPaid ? 'Already Paid' : 'Not Funded'}>
          <span>
            <IconButton
              color="success"
              disabled={!item.isFunded || item.isPaid}
              onClick={() => onPay(item._id)}
            >
              <CheckCircleIcon size={20} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Card>
  );
}
