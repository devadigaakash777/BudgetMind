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
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { convertExpenseDueDate } from '@/utils/convert-expense-due-date';
import { FormHelperText } from '@mui/material';

export type AccountSalaryFormProps = {
  hasSalary?: boolean;
  salaryAmount?: number;
  salaryDate?: number;
  jobTitle?: string;
  steadyDate?: number;
  steadyMonth?: number;
  steadyMonthlyAmount?: number;
  threshold?: number;
  onSave?: (values: {
    hasSalary: boolean;
    salaryAmount: number;
    salaryDate: number;
    jobTitle: string;
  }) => void;
  onSteadySave?: (values: {
    month: number;
    date: number;
    monthlyAmount: number;
  }) => void;
  onThresholdSave?: (value: { threshold: number }) => void;
};

export function AccountSalaryForm({
  hasSalary = true,
  salaryAmount = 0,
  salaryDate = 1,
  jobTitle = '',
  steadyMonth = 1,
  steadyDate = 1,
  steadyMonthlyAmount = 0,
  threshold = 0,
  onSave,
  onSteadySave,
  onThresholdSave,
}: AccountSalaryFormProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    hasSalary,
    salaryAmount,
    salaryDate,
    jobTitle,
    steadyMonth,
    steadyDate,
    steadyMonthlyAmount,
    threshold,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'salaryAmount' ||
        name === 'salaryDate' ||
        name === 'steadyMonth' ||
        name === 'steadyDate' ||
        name === 'steadyMonthlyAmount' ||
        name === 'threshold'
          ? Number(value)
          : value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      hasSalary: checked,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Always call onSave with hasSalary true or false
    if (onSave) {
      onSave({
        hasSalary: formData.hasSalary,
        salaryAmount: formData.salaryAmount,
        salaryDate: formData.salaryDate,
        jobTitle: formData.jobTitle,
      });
    }

    // Only call onSteadySave when hasSalary is false
    if (!formData.hasSalary && onSteadySave) {
      onSteadySave({
        month: formData.steadyMonth,
        date: formData.steadyDate,
        monthlyAmount: formData.steadyMonthlyAmount,
      });
    }

    // Always call threshold update
    if (onThresholdSave) {
      onThresholdSave({ threshold: formData.threshold });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Salary and Job Info" title="Salary Info" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <Typography variant="subtitle1">Has Salary</Typography>
              <Switch
                checked={formData.hasSalary}
                onChange={handleSwitchChange}
                color="primary"
              />
            </Grid>

            {formData.hasSalary && (
              <>
                <Grid
                  size={{
                    md: 6,
                    xs: 12,
                  }}
                >
                  <FormControl fullWidth required>
                    <InputLabel>Salary Amount</InputLabel>
                    <OutlinedInput
                      name="salaryAmount"
                      value={formData.salaryAmount === 0 ? '' : formData.salaryAmount}
                      onChange={handleInputChange}
                      label="Salary Amount"
                      type="number"
                    />
                  </FormControl>
                </Grid>
                <Grid
                  size={{
                    md: 6,
                    xs: 12,
                  }}
                >
                  <TextField
                    label="Salary Date"
                    name="salaryDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={convertExpenseDueDate(formData.salaryDate, 'toString')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryDate: e.target.value
                          ? (convertExpenseDueDate(e.target.value, 'toNumber') as number)
                          : 1,
                      }))
                    }
                    fullWidth
                  />
                </Grid>
                <Grid
                  size={{
                    md: 6,
                    xs: 12,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Job Title</InputLabel>
                    <OutlinedInput
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      label="Job Title"
                    />
                  </FormControl>
                </Grid>
              </>
            )}

            {!formData.hasSalary && (
              <>
                <Grid
                  size={{
                    md: 6,
                    xs: 12,
                  }}
                >
                  <FormControl fullWidth required>
                    <InputLabel>Steady Wallet Month</InputLabel>
                    <OutlinedInput
                      name="steadyMonth"
                      value={formData.steadyMonth === 0 ? '' : formData.steadyMonth}
                      onChange={handleInputChange}
                      label="Steady Wallet Month"
                      type="number"
                    />
                  </FormControl>
                </Grid>
                <Grid
                  size={{
                    md: 6,
                    xs: 12,
                  }}
                >
                  <FormControl fullWidth required>
                    <TextField
                      label="Steady Wallet Date"
                      name="steadyDate"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={convertExpenseDueDate(formData.steadyDate, 'toString')}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          steadyDate: e.target.value
                            ? (convertExpenseDueDate(e.target.value, 'toNumber') as number)
                            : 1,
                        }))
                      }
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid
                  size={{
                    md: 6,
                    xs: 12,
                  }}
                >
                  <FormControl fullWidth required>
                    <InputLabel>Steady Monthly Amount</InputLabel>
                    <OutlinedInput
                      name="steadyMonthlyAmount"
                      value={
                        formData.steadyMonthlyAmount === 0
                          ? ''
                          : formData.steadyMonthlyAmount
                      }
                      onChange={handleInputChange}
                      label="Steady Monthly Amount"
                      type="number"
                    />
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Threshold Balance */}
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
               <FormControl fullWidth required>
                <InputLabel>Threshold</InputLabel>
                <OutlinedInput
                  name="threshold"
                  value={formData.threshold === 0 ? '' : formData.threshold}
                  onChange={handleInputChange}
                  label="Threshold"
                  type="number"
                />
                <FormHelperText>
                  This is your safety amount. We&apos;ll try to always keep this much safe in your Secure Saving.
                </FormHelperText>
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
