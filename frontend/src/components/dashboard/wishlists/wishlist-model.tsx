import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stepper, Step, StepLabel,
  FormControl, InputLabel, OutlinedInput, InputAdornment,
  Stack, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CloudArrowUpIcon, LockIcon } from '@phosphor-icons/react/dist/ssr';
import { styled } from '@mui/material/styles';
import { WishlistCard } from '@/components/dashboard/wishlists/wishlist-card';

//wishlist type
type WishlistItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  savedAmount: number;
  priority: number;
  cost: number;
  monthLeft: number;
  isFunded: boolean;
};


// For hiding default input style
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type AddWishlistModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (item: WishlistItem) => void;
  maxPriority: number;
};

const steps = ['Basic Info', 'Priority & Cost', 'Finish'];

export default function AddWishlistModal({ open, onClose, onAdd, maxPriority }: AddWishlistModalProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [priorityMode, setPriorityMode] = React.useState<'none' | 'low' | 'custom' | 'high'>('none');

  const [formData, setFormData] = React.useState<WishlistItem>({
    id: '',  // auto generate
    name: '',
    description: '',
    image: '',
    savedAmount: 0,  // always 0
    priority: 0,     // based on mode
    cost: 0,
    monthLeft: 1,
    isFunded: false  // always false
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Generate ID
      const newItem = {
        ...formData,
        id: crypto.randomUUID(),
        savedAmount: 0,
        isFunded: false
      };
      onAdd(newItem);
      onClose();
      setActiveStep(0);  // reset
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Wishlist Item</DialogTitle>
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
              label="Item Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              startIcon={<CloudArrowUpIcon />}
            >
              {formData.image ? 'Change Image' : 'Upload Image'}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const imageURL = URL.createObjectURL(file);
                    setFormData({ ...formData, image: imageURL });
                  }
                }}
              />
            </Button>

            {/* Preview the uploaded image */}
            {formData.image && (
              <Box
                component="img"
                src={formData.image}
                alt="Uploaded"
                sx={{ mt: 2, width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 2 }}
              />
            )}
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={3} sx={{ mt: 3 }}>
            <FormControl required>
              <InputLabel>Cost</InputLabel>
              <OutlinedInput
                type="number"
                label="Cost"
                value={formData.cost === 0 ? '' : formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
              />
            </FormControl>

            <TextField
              label="Months Left"
              type="number"
              value={formData.monthLeft === 0 ? '' : formData.monthLeft}
              onChange={(e) => setFormData({ ...formData, monthLeft: Number(e.target.value) })}
              inputProps={{ min: 1 }}
            />

            <ToggleButtonGroup
              color="primary"
              value={priorityMode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode !== null) {
                  setPriorityMode(newMode);
                  if (newMode === 'none') setFormData({ ...formData, priority: 0 });
                  if (newMode === 'low') setFormData({ ...formData, priority: 1 });
                  if (newMode === 'high') setFormData({ ...formData, priority: maxPriority + 1 });
                }
              }}
            >
              <ToggleButton value="none">No Priority</ToggleButton>
              <ToggleButton value="low">Low Priority</ToggleButton>
              <ToggleButton value="custom">Custom Priority</ToggleButton>
              <ToggleButton value="high">High Priority</ToggleButton>
            </ToggleButtonGroup>

            {priorityMode === 'custom' && (
              <TextField
                label="Custom Priority"
                type="number"
                value={formData.priority === 0 ? '' : formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
              />
            )}
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            <div><LockIcon/> This is non-interactive preview. Buttons are disabled and for display only:</div>
              <Grid
              key={formData.id}
              size={{
                lg: 4,
                md: 6,
                xs: 12,
              }}
            >
              <WishlistCard
                item={formData}
                onDelete={(_id) => null}
                onIncreaseMonth={(_id) => null}
                onDecreaseMonth={(_id) => null}
                onBuy={(_id) => null}
                onIncreasePriority={(_id) => null}
                onDecreasePriority={(_id) => null}
              />
            </Grid>
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
                (activeStep === 0 && formData.name.trim() === '') ||  // Name required on Step 0
                (activeStep === 1 && formData.cost <= 0)               // Cost required on Step 1
            }
        >
            {activeStep === steps.length - 1 ? 'Add Item' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
