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
  DialogContent
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(Number(e.target.value));
    if (value >= 0) {
      setAmount(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      onSave(amount);
      onAdd?.();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
            <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader title="Expense Wallet" subheader="Tell us how much you currently adding to wallet" />
                <Divider />
                <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ md: 12, xs: 12 }}>
                    <Typography color="text.secondary" variant="overline">
                        Current Balance
                    </Typography>
                    <Typography variant="h4">₹{currentBalance}</Typography>
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
                <Button type="submit" variant="contained">
                    Save
                </Button>
                </CardActions>
            </Card>
            </form>
        </DialogContent>
    </Dialog> 
  );
}
