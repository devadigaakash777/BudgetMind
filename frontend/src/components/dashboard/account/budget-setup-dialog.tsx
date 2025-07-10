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
  onCalculateBudget: () => void
};

const steps = ['Total Wealth', 'Salary Info', 'Daily Budget'];

export function BudgetSetupDialog({
  open,
  onClose,
  onComplete,
  salary,
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
      console.log("onComplete is called");
      onComplete(true);
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
    // DO NOT call handleNext here directly
    // We wait until salary or steady save is complete to advance step
  };

  const handleDailyBudgetSave = (value: {
    setAmount: number;
    minAmount: number;
    maxAmount: number;
  }) => {
    onDailyBudgetSave(value);
    onCalculateBudget();
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
          <DailyBudgetForm salary={salary} onSave={handleDailyBudgetSave} />
        )}
      </DialogContent>

      <DialogActions>
        {/* <Button onClick={onClose}>Cancel</Button> */}
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
      </DialogActions>
    </Dialog>
  );
}
