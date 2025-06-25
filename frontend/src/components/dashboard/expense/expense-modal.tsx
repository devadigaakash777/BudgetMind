import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';

import { WalletChart } from '@/components/dashboard/overview/wallet-chart';
import GaugeSpeedometer from '@/components/dashboard/expense/expense-gauge-chart';

type GaugeLimit = { value: number; label?: string };

type AddExpenseModalProps = {
  userid: number;
  open: boolean;
  onAdd: (payload: {
    id: number;
    userId: number;
    amount: number;
    details: string;
    numberOfDays: number;
  }) => void;
  onClose: () => void;
  pieChartSeries: Record<string, number>;
  gaugeList: Record<string, GaugeLimit>;
};

export default function AddExpenseModal({
  userid,
  open,
  onAdd,
  onClose,
  pieChartSeries,
  gaugeList
}: AddExpenseModalProps) {
  
  // STATE to hold form data:
  const [amount, setAmount] = React.useState<number>(0);
  const [numberOfDays, setNumberOfDays] = React.useState<number>(1);
  const [details, setDetails] = React.useState<string>('');
  
  // To generate id (simple auto-increment — in real app you can use uuid or backend id)
  const [lastId, setLastId] = React.useState<number>(1000);

  const handleAdd = () => {
    const newId = lastId + 1;
    setLastId(newId);

    onAdd({
      id: newId,
      userId: userid,
      amount,
      details,
      numberOfDays
    });

    // Optional: reset form
    setAmount(0);
    setNumberOfDays(1);
    setDetails('');

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            label="Amount"
            variant="outlined"
            type="number"
            required
            value={amount === 0 ? '' : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          
          <GaugeSpeedometer
            list={gaugeList}
            value={amount/numberOfDays} // HERE: gauge will update live based on user input
          />

          <TextField
            label="Number Of Day"
            variant="outlined"
            type="number"
            inputProps={{ min: 1 }}
            required
            value={numberOfDays === 0 ? '' : numberOfDays}
            onChange={(e) => setNumberOfDays(Number(e.target.value))}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <WalletChart
            chartSeries={Object.values(pieChartSeries)}
            labels={Object.keys(pieChartSeries)}
            sx={{ height: '100%' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAdd} // CALL OUR FUNCTION
          disabled={amount <= 0}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
