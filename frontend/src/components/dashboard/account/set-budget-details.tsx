'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';

export type DailyBudgetFormProps = {
  salary: number;
  remainDays?: number | null;
  currentAmount?: number;
  setAmount?: number;
  minAmount?: number;
  maxAmount?: number;
  onSave?: (values: {
    setAmount: number;
    minAmount: number;
    maxAmount: number;
  }) => void;
};

const getDaysInMonth = () => new Date(
                                new Date().getFullYear(),
                                new Date().getMonth() + 1,
                                0
                                ).getDate();

export function DailyBudgetForm({
  salary = 0,
  remainDays = null,
  currentAmount = 0,
  setAmount = 0,
  minAmount = 0,
  maxAmount = 0,
  onSave,
}: DailyBudgetFormProps): React.JSX.Element {
  const [canEditAmount, setCanEditAmount] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState({
    setAmount,
    minAmount,
    maxAmount,
  });

  const maxAllowed = remainDays? Math.floor(salary / remainDays) : Math.floor(salary / getDaysInMonth());
  console.warn(salary, "and", remainDays);
  console.warn("max allowed amount is ",maxAllowed);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Math.floor(Number(value));

    // Clamp values between 0 and maxAllowed
    if (numericValue < 0 || numericValue > maxAllowed) return;

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanEditAmount(e.target.checked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSave) {
      onSave({
        setAmount: canEditAmount ? formData.setAmount : 0,
        minAmount: formData.minAmount,
        maxAmount: formData.maxAmount,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Daily Budget Info" subheader="Control your daily spending" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{
                    md: 6,
                    xs: 12,
                    }}
            >
              <FormControl fullWidth required>
                <InputLabel>Minimum Amount</InputLabel>
                <OutlinedInput
                  name="minAmount"
                  value={formData.minAmount || ''}
                  onChange={handleInputChange}
                  label="Minimum Amount"
                  type="number"
                />
                <FormHelperText>Whole number between 0 and {maxAllowed}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{
                    md: 6,
                    xs: 12,
                    }}
            >
              <FormControl fullWidth required>
                <InputLabel>Maximum Amount</InputLabel>
                <OutlinedInput
                  name="maxAmount"
                  value={formData.maxAmount || ''}
                  onChange={handleInputChange}
                  label="Maximum Amount"
                  type="number"
                />
                <FormHelperText>Whole number between 0 and {maxAllowed}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{
                    md: 6,
                    xs: 12,
                    }}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={canEditAmount} onChange={handleCheckboxChange} />
                  }
                  label="I want to predefine the budget"
                />
                {canEditAmount && (
                  <FormHelperText>
                    This fixed budget will apply only if you have sufficient balance.
                    Otherwise, daily spending will default between the min and max values.
                  </FormHelperText>
                )}
              </FormGroup>
            </Grid>

            {canEditAmount && (
              <Grid size={{
                    md: 6,
                    xs: 12,
                    }}
              >
                <FormControl fullWidth required>
                  <InputLabel>Set Amount</InputLabel>
                  <OutlinedInput
                    name="setAmount"
                    value={formData.setAmount || ''}
                    onChange={handleInputChange}
                    label="Set Amount"
                    type="number"
                  />
                  <FormHelperText>Whole number between 0 and {maxAllowed}</FormHelperText>
                </FormControl>
              </Grid>
            )}
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
