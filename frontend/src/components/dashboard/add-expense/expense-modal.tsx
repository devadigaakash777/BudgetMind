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
import { Box, FormHelperText, TextField, Typography } from '@mui/material';
import { VaultIcon, EyeIcon, LightbulbFilamentIcon } from '@phosphor-icons/react/dist/ssr';
import { WalletChart } from '@/components/dashboard/overview/wallet-chart';
import GaugeSpeedometer from '@/components/dashboard/add-expense/expense-gauge-chart';
import {adjustGaugeList} from '@/utils/adjust-gauge-list';
import {RequestMoneyModal } from '@/components/dashboard/add-expense/expense-request-model'

type GaugeLimit = { value: number; label?: string };

type AddExpenseFormProps = {
  userid: string;
  maximumSafeAmount: number;
  restrictedDuration: number | null;
  onAdd: (payload: {
    totalAmount: number;
    details: string;
    numberOfDays: number;
    source: 'main' | 'wishlist';
    canReduceBudget: boolean;
    usedBoth: boolean;
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
  sourceSelections: {
    main: boolean;
    wishlist: boolean;
  };
  setSourceSelections: React.Dispatch<React.SetStateAction<{
    main: boolean;
    wishlist: boolean;
  }>>;
};

export function AddExpenseForm({
  userid,
  maximumSafeAmount,
  restrictedDuration,
  onAdd,
  onAddPreview,
  pieChartSeries,
  gaugeList,
  onSelectSource,
  onChangeCanBudget,
  onRequest,
  sourceSelections,
  setSourceSelections,
}: AddExpenseFormProps): React.JSX.Element {
  
  const [formData, setFormData] = React.useState({
    amount: 0,
    numberOfDays: 1,
    details: ''
  });

  // Update source and budget status
  const [selectedSource, setSelectedSource] = React.useState<'main' | 'wishlist'>('main');
  const [canReduceBudget, setCanReduceBudget] = React.useState(false);


  // To check whether both selected
  const [usedBoth, setUsedBoth] = React.useState(false);
  React.useEffect(() => {
    if (sourceSelections.main && sourceSelections.wishlist) {
      setUsedBoth(true);
      console.log("✅ Both 'main' and 'wishlist' have been selected at least once.");
    }
  }, [sourceSelections]);

  //Request Money Model
  const [open, setOpen] = React.useState(false);
    
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //handle buttons depends on amount consumed
  const [canSave, setCanSave] = React.useState(true);
  const handleSaveOn = () => setCanSave(true);
  const handleSaveOff = () => setCanSave(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'details' ? value : Number(value)
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    onAdd({
      totalAmount: formData.amount,
      details: formData.details,
      numberOfDays: restrictedDuration? Math.min(formData.numberOfDays, restrictedDuration): formData.numberOfDays,
      source: selectedSource,
      canReduceBudget: canReduceBudget,
      usedBoth: usedBoth
    });

    //Preview mode
    

    // Optional reset:
    setFormData({
      amount: 0,
      numberOfDays: 1,
      details: ''
    });
  };

  const secureSaving = adjustGaugeList(gaugeList, formData.numberOfDays)
  const moneyToAsk = secureSaving['Spending Wallet'].value;

  const safeAmount = moneyToAsk - maximumSafeAmount;
  
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
              ? Math.max(formData.amount - moneyToAsk, 0)
              : 0
          }
          onSelectSource={(value) => {
            setSelectedSource(value);
            onSelectSource(value); 
            setSourceSelections((prev) => ({ ...prev, [value]: true })); // still increments normally
          }}
          onChangeCanBudget={(val) => {
            setCanReduceBudget(val);
            onChangeCanBudget(val); 
          }}
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
                  inputProps={{ min: 1 }}
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
                  inputProps={{ 
                    min: 1, 
                    ...(restrictedDuration !== null && { max: restrictedDuration }),
                  }}
                  error={restrictedDuration !== null && formData.numberOfDays > restrictedDuration}
                />
                <FormHelperText>
                  {restrictedDuration !== null && formData.numberOfDays > restrictedDuration
                    ? `Max allowed days is ${restrictedDuration}`
                    : ' '}
                </FormHelperText>
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
              lg: 12,
              md: 12,
              xs: 12,
            }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.2,
                  backgroundColor: '#fff8e1',           // light yellow background
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #ffe082',          // soft yellow border
                  maxWidth: 600,
                  boxShadow: 1,
                }}
              >
                <LightbulbFilamentIcon
                  size={22}
                  weight="duotone"
                  color="black"
                  style={{ marginTop: 4 }} // bright yellow fill
                />

                <Typography variant="body2" color="text.secondary">
                  <strong>Tip:</strong> You can use Maximum <strong>₹{safeAmount}</strong> this today <br />
                  without affecting your daily budget, wishlist savings, or bill payments on next month.
                  <br />
                  Staying within this limit helps avoid delays or missed expenses.
                </Typography>
              </Box>
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
          <Button type="submit" variant="contained" disabled={!canSave || formData.amount <= 0}>
            Add Expense
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
