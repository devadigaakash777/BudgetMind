import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Alert, AlertTitle, Button,ButtonGroup, CardActions, CardContent, CardMedia, Chip } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {InsufficientFundDialog} from '@/components/dashboard/layout/Insufficient-fund-dialog';
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ShoppingCartIcon,
  StarIcon
} from '@phosphor-icons/react/dist/ssr';
import { CalendarDots, CalendarDotsIcon, SealIcon } from '@phosphor-icons/react';
import { yellow } from '@mui/material/colors';

export interface WishlistItem {
  _id?: string;
  name: string;
  description: string;
  image: string;
  savedAmount: number;
  cost: number;
  priority: number;
  monthLeft: number;
  isFunded: boolean;
}

export interface WishlistCardProps {
  item: WishlistItem;
  onDelete: (id: string) => void;
  onIncreaseMonth: (id: string) => void;
  onDecreaseMonth: (id: string) => void;
  onBuy: (id: string, preference: 'main' | 'wishlist', reduceDailyBudget: boolean) => void;
  onIncreasePriority: (id: string) => void;
  onDecreasePriority: (id: string) => void;
}

export function WishlistCard({
  item,
  onDelete,
  onIncreaseMonth,
  onDecreaseMonth,
  onBuy,
  onIncreasePriority,
  onDecreasePriority
}: WishlistCardProps): React.JSX.Element {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleBuy = () => {
    if (item.isFunded) {
      onBuy(item._id ?? 'demo', "main", false);
    } else {
      setDialogOpen(true);
    }
  };

  const handleConfirmDialog = ({ preference, reduceDailyBudget }: { preference: 'main' | 'wishlist', reduceDailyBudget: boolean }) => {
    onBuy(item._id ?? 'demo', preference, reduceDailyBudget);
     setDialogOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 350, display: 'flex', flexDirection: 'column', boxShadow: 3, py: 1}}>
      {/* Image */}
      <CardMedia
        component="img"
        height="150"
        image={item.image}
        alt={item.name}
        sx={{ objectFit: 'contain' }}
      />

      <Divider sx={{ mt: 1 }} />
      {/* Main Content */}
      <CardContent>
        <Typography variant="h5" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {item.description}
        </Typography>

        {/* Info Row */}
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#f9fafb',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
          }}
        >
          {/* Saved */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e3f2fd', // light blue
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: '#1976d2' }}
            >
              💰 Saved: ₹{item.savedAmount}
            </Typography>
          </Box>

          {/* Cost */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff3e0', // light orange
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: '#fb8c00' }}
            >
              💸 Cost: ₹{item.cost}
            </Typography>
          </Box>

          {/* Months Left */}
          <Box sx={{ gridColumn: '1 / -1', mt: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: '#616161' }}
            >
              ⏳ {item.monthLeft} Months Left to Purchase
            </Typography>
          </Box>

          {/* Priority */}
          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e8f5e9', // light green
              borderRadius: 1,
              px: 1,
              py: 0.5,
              mt: 0.5,
            }}
          >
            <SealIcon
              size={16}
              style={{ fill: '#43a047', marginRight: 4 }}
              weight="fill"
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: '#43a047' }}
            >
              Priority: {item.priority}
            </Typography>
          </Box>
        </Box>
        {/* Funded Status */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {!item.isFunded && (
            <>
              <Alert severity="error" 
               sx={{
                    fontSize: 12,
                    py: 0.5,
                    px: 1,
                    '& .MuiAlertTitle-root': {
                      fontSize: 13,
                      mb: 0.3
                    }
                  }}
              >
                <AlertTitle>Not Funded</AlertTitle>
                This product isn’t funded. You can still purchase it—your spending wallet will be used first, with fallback to other wallets if needed.
              </Alert>
            </>
          )}
        </Box>
      </CardContent>

      <Divider />

      {/* Controls */}
      <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight="medium">Adjust Months Left:</Typography>
          <ButtonGroup variant="outlined" aria-label="Basic button group" size="small">
            <Button onClick={() => onDecreaseMonth(item._id ?? 'demo')}>-</Button>
            <Button onClick={() => onIncreaseMonth(item._id ?? 'demo')}>+</Button>
          </ButtonGroup>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight="medium">Change Priority:</Typography>
          <ButtonGroup variant="outlined" aria-label="Basic button group" size="small">
            <Button onClick={() => onDecreasePriority(item._id ?? 'demo')}>-</Button>
            <Button onClick={() => onIncreasePriority(item._id ?? 'demo')}>+</Button>
          </ButtonGroup>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tooltip title="Buy Item">
            <Chip variant="filled" onClick={handleBuy} color="success" icon={<ShoppingCartIcon size={20} />} label="Buy" />
          </Tooltip>

          <Tooltip title="Delete Item">
            <Chip variant="filled" onClick={() => onDelete(item._id ?? 'demo')} color="error" icon={<TrashIcon size={20} />} label="Delete" />
          </Tooltip>
        </Box>
      </CardActions>

      {/* Dialog */}
      <InsufficientFundDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmDialog}
      />
    </Card>
  );
}
