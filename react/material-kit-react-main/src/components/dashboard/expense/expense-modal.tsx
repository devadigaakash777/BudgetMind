import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { WalletChart } from '@/components/dashboard/overview/wallet-chart';

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddExpenseModal({ open, onClose }: AddExpenseModalProps) {
  const expenseState = useSelector((state: RootState) => state.expense);
  const walletState = useSelector((state: RootState) => state.wallet);

  // Pie chart content
  const pieChartSeries = {
    'Secure Saving': walletState.MainWallet.balance,
    'Spending Wallet': walletState.TemporaryWallet.balance,
    'Monthly Allowance': walletState.SteadyWallet.balance,
    'Budget Leftover': walletState.DailyBuffer.balance,
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Name" variant="outlined" defaultValue={expenseState.rowsPerPage} required />
          <TextField label="Amount" variant="outlined" type="number" required />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select label="Category" defaultValue="">
              <MenuItem value="TV">TV/Monitors</MenuItem>
              <MenuItem value="PC">PC</MenuItem>
              <MenuItem value="GA">Gaming/Console</MenuItem>
              <MenuItem value="PH">Phones</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            multiline
            rows={4}
            variant="outlined"
          />
        </Box>
        <WalletChart chartSeries={Object.values(pieChartSeries)} labels={Object.keys(pieChartSeries)} sx={{ height: '100%' }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => { /* submit logic */ }}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
