import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button,ButtonGroup } from '@mui/material';

import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ShoppingCartIcon,
  StarIcon
} from '@phosphor-icons/react/dist/ssr';

export interface WishlistItem {
  id: string;
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
  onBuy: (id: string) => void;
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
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 1 }}>
      {/* Row 1: Image + Main Info */}
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        {/* Product Image */}
        <Avatar
          src={item.image}
          variant="square"
          sx={{ width: 100, height: 100, borderRadius: 1 }}
        />

        {/* Main Content */}
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {item.description}
          </Typography>

          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography variant="body2">Saved: ₹{item.savedAmount}</Typography>
            <Typography variant="body2">Cost: ₹{item.cost}</Typography>
            <Typography variant="body2">Months Left: {item.monthLeft}</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              Priority: {item.priority}
              <StarIcon size={16} weight="fill" style={{ marginLeft: 4 }} />
            </Typography>
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
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Row 2: Action Buttons */}
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Tooltip title="Delete Item">
          <IconButton color="error" onClick={() => onDelete(item.id)}>
            <TrashIcon size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Change Months Left">
          <ButtonGroup
            disableElevation
            variant="outlined"
            aria-label="Disabled button group"
          >
            <Button onClick={() => onDecreaseMonth(item.id)}>-</Button>
            <Button onClick={() => onIncreaseMonth(item.id)}>+</Button>
          </ButtonGroup>
        </Tooltip>

        <Tooltip title="Decrease Priority">
          <ButtonGroup
            disableElevation
            variant="outlined"
            aria-label="Disabled button group"
          >
            <Button onClick={() => onDecreasePriority(item.id)}>-</Button>
            <Button onClick={() => onIncreasePriority(item.id)}>+</Button>
          </ButtonGroup>
        </Tooltip>

        <Tooltip title={item.isFunded ? 'Buy Item' : 'Item not funded'}>
          <span>
            <IconButton
              color="success"
              disabled={!item.isFunded}
              onClick={() => onBuy(item.id)}
            >
              <ShoppingCartIcon size={20} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Card>
  );
}
