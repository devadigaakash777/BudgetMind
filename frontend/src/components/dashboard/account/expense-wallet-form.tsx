'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  Dialog,
  DialogContent,
  Switch,
  FormControlLabel,
} from '@mui/material';

export type TempWalletProps = {
  open: boolean;
  onClose: () => void;
  currentBalance: number;
  onAdd?: () => void;
  onSave?: (value: number) => void;
};

export function TempWalletForm({
  open,
  onClose,
  currentBalance = 0,
  onAdd,
  onSave,
}: TempWalletProps): React.JSX.Element {
  const [amount, setAmount] = React.useState<number>(0);
  const [isAddMode, setIsAddMode] = React.useState<boolean>(true); // Toggle state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(Number(e.target.value));
    if (value >= 0) {
      setAmount(value);
    }
  };

  const handleClose = () => {
    setAmount(0);         // Reset amount
    setIsAddMode(true);   // Reset toggle to Add
    onClose();            // Close modal
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      const finalValue = isAddMode ? amount : -amount; // Convert to negative if deduct
      onSave(finalValue);
      onAdd?.();
      onClose();
      setAmount(0); // Reset
      setIsAddMode(true); // Reset toggle
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              title="Expense Wallet"
              subheader="Manage your wallet balance"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ md: 12, xs: 12 }}>
                  <Typography color="text.secondary" variant="overline">
                    Current Balance
                  </Typography>
                  <Typography variant="h4">₹{currentBalance}</Typography>
                </Grid>

                {/* Toggle between Add and Deduct */}
                <Grid size={{ md: 12, xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isAddMode}
                        onChange={() => setIsAddMode(!isAddMode)}
                        color="primary"
                      />
                    }
                    label={isAddMode ? 'Add Money' : 'Deduct Money'}
                  />
                </Grid>

                <Grid size={{ md: 12, xs: 12 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Amount (in ₹)</InputLabel>
                    <OutlinedInput
                      name="setAmount"
                      value={amount || ''}
                      onChange={handleChange}
                      label="Set Amount"
                      type="number"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
               <Button variant="outlined" onClick={handleClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {isAddMode ? 'Add to Wallet' : 'Deduct from Wallet'}
              </Button>
            </CardActions>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
}
