'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField } from '@mui/material';

import { WalletChart } from '@/components/dashboard/overview/wallet-chart';
import GaugeSpeedometer from '@/components/dashboard/expense/expense-gauge-chart';

type GaugeLimit = { value: number; label?: string };

type AddExpenseFormProps = {
  userid: number;
  onAdd: (payload: {
    id: number;
    userId: number;
    amount: number;
    details: string;
    numberOfDays: number;
  }) => void;
  pieChartSeries: Record<string, number>;
  gaugeList: Record<string, GaugeLimit>;
};

export function AddExpenseForm({
  userid,
  onAdd,
  pieChartSeries,
  gaugeList
}: AddExpenseFormProps): React.JSX.Element {
  
  const [formData, setFormData] = React.useState({
    amount: 0,
    numberOfDays: 1,
    details: ''
  });

  const [lastId, setLastId] = React.useState<number>(1000);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'details' ? value : Number(value)
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newId = lastId + 1;
    setLastId(newId);

    onAdd({
      id: newId,
      userId: userid,
      amount: formData.amount,
      details: formData.details,
      numberOfDays: formData.numberOfDays
    });

    // Optional reset:
    setFormData({
      amount: 0,
      numberOfDays: 1,
      details: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add a new expense" title="Expense Form" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              size={{
              lg: 6,
              md: 6,
              xs: 12,
            }}
            >
              <FormControl fullWidth required>
                <InputLabel>Amount</InputLabel>
                <OutlinedInput
                  name="amount"
                  value={formData.amount === 0 ? '' : formData.amount}
                  onChange={handleInputChange}
                  label="Amount"
                  type="number"
                />
              </FormControl>
            </Grid>
            <Grid
              size={{
              lg: 6,
              md: 6,
              xs: 12,
            }}
            >
              <FormControl fullWidth required>
                <InputLabel>Number of Days</InputLabel>
                <OutlinedInput
                  name="numberOfDays"
                  value={formData.numberOfDays === 0 ? '' : formData.numberOfDays}
                  onChange={handleInputChange}
                  label="Number of Days"
                  type="number"
                  inputProps={{ min: 1 }}
                />
              </FormControl>
            </Grid>
            <Grid size={{
              lg: 6,
              md: 6,
              xs: 12,
            }}>

            <GaugeSpeedometer
                list={gaugeList}
                value={
                  formData.numberOfDays > 0
                    ? formData.amount / formData.numberOfDays
                    : 0
                }
              />
            </Grid>

            
            <Grid size={{
              lg: 6,
              md: 6,
              xs: 12,
            }}>
              <WalletChart
                chartSeries={Object.values(pieChartSeries)}
                labels={Object.keys(pieChartSeries)}
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid size={{
              lg: 6,
              md: 6,
              xs: 12,
            }}>
              <TextField
                fullWidth
                name="details"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                value={formData.details}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={formData.amount <= 0}>
            Add Expense
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
