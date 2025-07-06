import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';

import { WalletIcon, PiggyBankIcon, ChartPieSliceIcon } from '@phosphor-icons/react/dist/ssr';

type RequestMoneyModalProps = {
  open: boolean;
  onClose: () => void;
  overage: number;
  statusList: Record<string, number>;
  onSelectSource: (value: 'main' | 'wishlist') => void;
  onChangeCanBudget: (val: boolean) => void;
  onRequest: (amount: number, source: 'main' | 'wishlist', canChange: boolean) => void;
};

export function RequestMoneyModal({
  open,
  onClose,
  overage,
  statusList,
  onSelectSource,
  onChangeCanBudget,
  onRequest
}: RequestMoneyModalProps) {
  const [source, setSource] = React.useState<'main' | 'wishlist'>('main');
  const [canChange, setCanChange] = React.useState(false);

  const handleSubmit = () => {
    onSelectSource(source);
    onChangeCanBudget(canChange);
    console.log(overage);
    onRequest(overage, source, canChange);
    onClose();
  };

  const totalCostMain = statusList['Secure Saving'] + statusList['Bill Saving'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Request Money</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={source}
            label="Source"
            onChange={(e) => setSource(e.target.value as 'main' | 'wishlist')}
          >
            <MenuItem value="main">Main Wallet</MenuItem>
            <MenuItem value="wishlist">Wishlist Wallet</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Overage"
          value={overage}
          InputProps={{ readOnly: true }}
          type="number"
        />

        {source === 'main' && (
          <FormControlLabel
            control={
              <Checkbox
                checked={canChange}
                onChange={(e) => setCanChange(e.target.checked)}
              />
            }
            label="Allow Budget Reduction"
          />
        )}
        {/* Status Summary List */}
        <List sx={{ width: '100%', maxWidth: 360 }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PiggyBankIcon size={20} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Secure Saving (Use Main Wallet)"
              secondary={`Max: ₹${statusList['Secure Saving'] ?? 0}`}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <WalletIcon size={20} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Wishlist Saving (Use Wishlist Wallet)"
              secondary={`Max: ₹${statusList['Wishlist Saving'] ?? 0}`}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ChartPieSliceIcon size={20} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Secure Saving + Bill Saving (Use Main Wallet)"
              secondary={`Max: ₹${totalCostMain ?? 0}`}
            />
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions sx={{ mb: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
