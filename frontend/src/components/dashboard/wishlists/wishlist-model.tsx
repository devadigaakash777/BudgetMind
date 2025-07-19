import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stepper, Step, StepLabel,
  FormControl, InputLabel, OutlinedInput, InputAdornment,
  Stack, ToggleButtonGroup, ToggleButton,
  Alert
} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CloudArrowUpIcon, LockIcon } from '@phosphor-icons/react/dist/ssr';
import { styled } from '@mui/material/styles';
import { WishlistCard } from '@/components/dashboard/wishlists/wishlist-card';
import { WishlistItemBase } from '@/types/wishlist';

// Hidden file input style
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
  onAdd: (item: WishlistItemBase) => void;
  maxPriority: number;
};

const steps = ['Basic Info', 'Priority & Cost', 'Finish'];

export default function AddWishlistModal({ open, onClose, onAdd, maxPriority }: AddWishlistModalProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [priorityMode, setPriorityMode] = React.useState<'none' | 'low' | 'custom' | 'high'>('low');

  const [formData, setFormData] = React.useState<WishlistItemBase>({
    name: '',
    description: '',
    image: '',
    savedAmount: 0,
    priority: 1,
    cost: 0,
    monthLeft: 1,
    isFunded: false
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const newItem: WishlistItemBase = {
        ...formData,
        savedAmount: 0,
        isFunded: false
      };
      onAdd(newItem);
      onClose();
      setActiveStep(0);
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
              variant="outlined"
              startIcon={<CloudArrowUpIcon />}
            >
              {formData.image ? 'Change Image' : 'Upload Image'}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  const data = new FormData();
                  data.append("file", file);
                  data.append("upload_preset", "upload_budget_mind");
                  data.append("cloud_name", "ddmlou0da");

                  try {
                    const res = await fetch("https://api.cloudinary.com/v1_1/ddmlou0da/image/upload", {
                      method: "POST",
                      body: data
                    });

                    const result = await res.json();
                    setFormData(prev => ({ ...prev, image: result.secure_url }));
                  } catch (error) {
                    console.error("Upload failed", error);
                  }
                }}
              />
            </Button>

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
              value={formData.priority === 0 ? 1 : formData.monthLeft}
              onChange={(e) => setFormData({ ...formData, monthLeft: Number(e.target.value) })}
              inputProps={{ min: 1 }}
              disabled={formData.priority === 0}
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
            {priorityMode === 'none' && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This item has 0 priority and will be excluded from automatic funding during salary distribution.
              </Alert>
            )}
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <LockIcon /> This is a non-interactive preview.
            </Box>
            <Grid size={{
                lg: 4,
                md: 6,
                xs: 12,
              }}>
              <WishlistCard
                item={formData}
                onDelete={() => null}
                onIncreaseMonth={() => null}
                onDecreaseMonth={() => null}
                onBuy={() => null}
                onIncreasePriority={() => null}
                onDecreasePriority={() => null}
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
            (activeStep === 0 && formData.name.trim() === '') ||
            (activeStep === 1 && formData.cost <= 0)
          }
        >
          {activeStep === steps.length - 1 ? 'Add Item' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
