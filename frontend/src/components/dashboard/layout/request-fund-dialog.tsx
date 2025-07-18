import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, FormControlLabel, Radio, RadioGroup, Checkbox,
  Button
} from '@mui/material';
import React from 'react';

export interface FundDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (options: { preference: 'main' | 'wishlist'; reduceDailyBudget: boolean }) => void;
}

export function InsufficientFundDialog({ open, onClose, onConfirm }: FundDialogProps) {
  const [preference, setPreference] = React.useState<'main' | 'wishlist'>('main');
  const [reduceDailyBudget, setReduceDailyBudget] = React.useState(false);

  const handleConfirm = () => {
    onConfirm({ preference, reduceDailyBudget });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Insufficient Funds</DialogTitle>
      <DialogContent>
        <p>
          You don&apos;t have enough saved funds. The remaining amount will be deducted from your Spending Wallet.
          If that&apos;s still insufficient, please choose which wallet to use first to cover the rest:
        </p>
        <FormControl>
          <RadioGroup
            value={preference}
            onChange={(e) => setPreference(e.target.value as 'main' | 'wishlist')}
          >
            <FormControlLabel value="main" control={<Radio />} label="Use from Secure Saving" />
            <FormControlLabel value="wishlist" control={<Radio />} label="Use from Wishlist Savings" />
          </RadioGroup>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={reduceDailyBudget}
              onChange={(e) => setReduceDailyBudget(e.target.checked)}
            />
          }
          label="Allow reducing daily budget if needed"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
