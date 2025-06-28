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
} from '@mui/material';

export type TotalWealthProps = {
  onSave?: (value: number) => void;
};

export function TotalWealthForm({
  onSave,
}: TotalWealthProps): React.JSX.Element {
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Total Wealth" subheader="Tell us how much you currently have in total" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ md: 12, xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel>Total Wealth (in ₹)</InputLabel>
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
  );
}
