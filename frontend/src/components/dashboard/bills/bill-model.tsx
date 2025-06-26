'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stepper, Step, StepLabel,
  FormControl, InputLabel, OutlinedInput, InputAdornment,
  Stack, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { LockIcon } from '@phosphor-icons/react/dist/ssr';
import { FixedExpenseCard } from '@/components/dashboard/bills/bill-card';
import { convertExpenseDueDate } from '@/utils/convert-expense-due-date';
import { Expense } from '@/types/budget'

const steps = ['Basic Info', 'Amount & Duration', 'Finish'];

type AddFixedExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Expense) => void;
};

export default function AddFixedExpenseModal({ open, onClose, onAdd }: AddFixedExpenseModalProps) {
  const [activeStep, setActiveStep] = React.useState(0);

  const [formData, setFormData] = React.useState({
    id: 0, // will be generated
    billName: '',
    status: 'pending',
    dueDate: 1,
    isPaid: false,
    amount: 0,
    isPermanent: false,
    isFunded: false,
    durationInMonths: 1,
    amountToFund: 0
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Generate ID
      const newItem = {
        ...formData,
        id: Date.now(), // quick id
        status: 'pending' as const,
        isPaid: false,
        isFunded: false,
        amountToFund: formData.amount
      };
      onAdd(newItem);
      onClose();
      setActiveStep(0);
      setFormData({
        id: 0,
        billName: '',
        status: 'pending',
        dueDate: 1,
        isPaid: false,
        amount: 0,
        isPermanent: false,
        isFunded: false,
        durationInMonths: 1,
        amountToFund: 0
      });
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Fixed Expense</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            <TextField
              label="Bill Name"
              required
              value={formData.billName}
              onChange={(e) => setFormData({ ...formData, billName: e.target.value })}
            />
            <TextField
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={convertExpenseDueDate(formData.dueDate, "toString")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dueDate: e.target.value
                          ? convertExpenseDueDate(e.target.value, 'toNumber') as number
                          : 1
                })
              }
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={3} sx={{ mt: 3 }}>
            <FormControl required>
              <InputLabel>Amount</InputLabel>
              <OutlinedInput
                type="number"
                label="Amount"
                value={formData.amount === 0 ? '' : formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
              />
            </FormControl>

            <TextField
              label="Duration (Months)"
              type="number"
              disabled={formData.isPermanent}
              value={formData.durationInMonths === 0 ? '' : formData.durationInMonths}
              onChange={(e) => setFormData({ ...formData, durationInMonths: Number(e.target.value) })}
              inputProps={{ min: 1 }}
            />

            <ToggleButtonGroup
              color="primary"
              value={formData.isPermanent ? 'permanent' : 'temporary'}
              exclusive
              onChange={(_, newMode) => {
                if (newMode === 'permanent') {
                  setFormData({ ...formData, isPermanent: true });
                } else if (newMode === 'temporary') {
                  setFormData({ ...formData, isPermanent: false });
                }
              }}
            >
              <ToggleButton value="temporary">Temporary</ToggleButton>
              <ToggleButton value="permanent">Permanent</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            <div><LockIcon /> This is preview. Actions are disabled:</div>
            <FixedExpenseCard
              item={formData}
              onDelete={() => null}
              onPay={() => null}
              onIncreaseDuration={() => null}
              onDecreaseDuration={() => null}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ mb: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            (activeStep === 0 && formData.billName.trim() === '') ||
            (activeStep === 1 && formData.amount <= 0)
          }
        >
          {activeStep === steps.length - 1 ? 'Add Expense' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
