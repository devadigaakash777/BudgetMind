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
import { VaultIcon, EyeIcon } from '@phosphor-icons/react/dist/ssr';
import { WalletChart } from '@/components/dashboard/overview/wallet-chart';
import GaugeSpeedometer from '@/components/dashboard/add-expense/expense-gauge-chart';
import {RequestMoneyModal } from '@/components/dashboard/add-expense/expense-request-model'

type GaugeLimit = { value: number; label?: string };

type AddExpenseFormProps = {
  userid: number;
  maximumSafeAmount: number;
  onAdd: (payload: {
    id: number;
    userId: number;
    amount: number;
    details: string;
    numberOfDays: number;
  }) => void;
  onAddPreview: (payload: {
    amount: number; 
    duration?: number
  }) =>void;
  pieChartSeries: Record<string, number>;
  gaugeList: Record<string, GaugeLimit>;
  onSelectSource: (value: 'main' | 'wishlist') => void;
  onChangeCanBudget: (val: boolean) => void;
  onRequest: (amount: number, source: 'main' | 'wishlist', canChange: boolean) => void;
};

export function AddExpenseForm({
  userid,
  maximumSafeAmount,
  onAdd,
  onAddPreview,
  pieChartSeries,
  gaugeList,
  onSelectSource,
  onChangeCanBudget,
  onRequest
}: AddExpenseFormProps): React.JSX.Element {
  
  const [formData, setFormData] = React.useState({
    amount: 0,
    numberOfDays: 1,
    details: ''
  });

  //Request Money Model
  const [open, setOpen] = React.useState(false);
    
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //handle buttons depends on amount consumed
  const [canSave, setCanSave] = React.useState(true);
  const handleSaveOn = () => setCanSave(true);
  const handleSaveOff = () => setCanSave(false);

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

    //Preview mode
    

    // Optional reset:
    setFormData({
      amount: 0,
      numberOfDays: 1,
      details: ''
    });
  };

  const secureSaving = gaugeList['Spending Wallet'].value;


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add a new expense" title="Expense Form" />
        <RequestMoneyModal
          open={open}
          onClose={handleClose}
          statusList={pieChartSeries}
          overage={
            formData.numberOfDays > 0
              ? Math.max(formData.amount - maximumSafeAmount, 0)
              : 0
          }
          onSelectSource={onSelectSource}
          onChangeCanBudget={onChangeCanBudget}
          onRequest={onRequest}
        />
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
              lg: 12,
              md: 12,
              xs: 12,
            }}>
            {canSave ? (
                <Button
                  variant="contained"
                  startIcon={<EyeIcon />}
                  disabled={formData.amount <= 0}
                  onClick={() =>
                    onAddPreview({
                      amount: formData.amount,
                      duration: formData.numberOfDays,
                    })
                  }
                >
                  Preview
                </Button>
              ) : (
                <Button startIcon={<VaultIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
                  Take From Secure Saving or Wishlist Item
                </Button>
              )}

            </Grid>
            <Grid size={{
              lg: 6,
              md: 6,
              xs: 12,
            }}>

            <GaugeSpeedometer
                setCanSave={handleSaveOn}
                setCanNotSave={handleSaveOff}
                list={gaugeList}
                days={Math.max(formData.numberOfDays, 1)}
                value={ formData.amount }
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
          <Button type="submit" variant="contained" disabled={formData.amount <= 0 || formData.amount > secureSaving}>
            Add Expense
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
