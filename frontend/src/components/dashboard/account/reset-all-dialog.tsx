'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';

export type ResetAllDialogProps = {
  open: boolean;
  onClose: () => void;
  onReset: (deleteDailyExpenses: boolean) => void;
};

export function ResetAllDialog({
  open,
  onClose,
  onReset,
}: ResetAllDialogProps): React.JSX.Element {
  const [deleteDaily, setDeleteDaily] = React.useState(false);

  const handleClose = () => {
    setDeleteDaily(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onReset(deleteDaily);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              title="Reset Profile Data"
              subheader="This will reset all the details including your salary, steady wallet, spending wallet, secure wallet, wishlist and bills ."
            />
            <Divider />
            <CardContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This will erase all saved financial data. Proceed only if you&apos;re sure.
              </Alert>
              <DialogContentText sx={{ mb: 2 }}>
                Do you also want to delete daily expense records?
              </DialogContentText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deleteDaily}
                    onChange={(e) => setDeleteDaily(e.target.checked)}
                  />
                }
                label="Also delete daily expenses"
              />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} color="inherit" variant="outlined">
                Cancel
              </Button>
              <Button type="submit" color="error" variant="contained">
                Reset
              </Button>
            </CardActions>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
}
