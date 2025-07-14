'use client';

import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stepper, Step, StepLabel
} from '@mui/material';
import { TotalWealthForm } from '@/components/dashboard/account/total-wealth';
import { AccountSalaryForm } from '@/components/dashboard/account/account-salary-form';
import { DailyBudgetForm } from '@/components/dashboard/account/set-budget-details';

type BudgetSetupDialogProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (value: boolean) => void;
  salary: number;
  remainDays: number;
  onTotalWealthSave: (value: number) => void;
  onSalarySave: (data: {
    hasSalary: boolean;
    salaryAmount: number;
    salaryDate: number;
    jobTitle: string;
  }) => void;
  onSteadySave: (data: {
    month: number;
    date: number;
    monthlyAmount: number;
  }) => void;
  onThresholdSave: (data: { threshold: number }) => void;
  onDailyBudgetSave: (values: {
    setAmount: number;
    minAmount: number;
    maxAmount: number;
  }) => void;
  onCalculateBudget: () => void;
};

const steps = ['Total Wealth', 'Salary Info', 'Daily Budget', 'Confirmation'];

export function BudgetSetupDialog({
  open,
  onClose,
  onComplete,
  salary,
  remainDays,
  onTotalWealthSave,
  onSalarySave,
  onSteadySave,
  onThresholdSave,
  onDailyBudgetSave,
  onCalculateBudget
}: BudgetSetupDialogProps) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onCalculateBudget();
      // onComplete(true);
      onClose();
      setActiveStep(0);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleTotalWealthSave = (value: number) => {
    onTotalWealthSave(value);
    handleNext();
  };

  const handleThresholdSave = (value: { threshold: number }) => {
    onThresholdSave(value);
    // Do not call handleNext here directly
  };

  const handleDailyBudgetSave = (value: {
    setAmount: number;
    minAmount: number;
    maxAmount: number;
  }) => {
    onDailyBudgetSave(value);
    handleNext();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Setup Budget Plan</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <TotalWealthForm onSave={handleTotalWealthSave} />
        )}

        {activeStep === 1 && (
          <AccountSalaryForm
            onSave={(data) => {
              onSalarySave(data);
              handleNext();
            }}
            onSteadySave={(data) => {
              onSteadySave(data);
            }}
            onThresholdSave={handleThresholdSave}
          />
        )}

        {activeStep === 2 && (
          <DailyBudgetForm salary={salary} remainDays={remainDays} onSave={handleDailyBudgetSave} />
        )}

        {activeStep === 3 && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p>Review your entries and finalize the setup.</p>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

        {activeStep === 3 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Finalize
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
