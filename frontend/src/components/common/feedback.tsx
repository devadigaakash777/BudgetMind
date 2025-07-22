import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { submitFeedbackThunk } from "@/redux/thunks/feedback-thunk";

// Define props for control
interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackDialog({ open, onClose }: FeedbackDialogProps) {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const userEmail = userState.data?.email || "";
  const username = userState.data?.firstName || "";

  const [feedbackType, setFeedbackType] = React.useState("General");
  const [name, setName] = React.useState(username);
  const [email, setEmail] = React.useState(userEmail);
  const [message, setMessage] = React.useState("");
  const [rating, setRating] = React.useState<number | null>(3);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Reset form whenever dialog closes
  React.useEffect(() => {
    if (!open) {
      setFeedbackType("General");
      setName(username);
      setEmail(userEmail);
      setMessage("");
      setRating(3);
    }
  }, [open, username, userEmail]);

  const handleSubmit = () => {
    if (!message.trim()) return;

    dispatch(
      submitFeedbackThunk({
        feedbackType,
        name,
        email,
        message,
        rating: rating || 0,
      })
    );
    onClose(); // Let parent close the dialog
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="feedback-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="feedback-dialog-title" sx={{ textAlign: "center" }}>
        📝 We’d love your Feedback
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Share your thoughts to help us improve BudgetMind.
        </Typography>

        <TextField
          select
          label="Feedback Type"
          value={feedbackType}
          onChange={(e) => setFeedbackType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="General">General</MenuItem>
          <MenuItem value="Bug">Bug Report</MenuItem>
          <MenuItem value="Suggestion">Feature Suggestion</MenuItem>
        </TextField>

        <TextField
          label="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Your Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
          required
        />

        {feedbackType === "General" && (
        <Box mt={2} display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 1 }}>
            Rate Us:
            </Typography>
            <Rating
            name="feedback-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            />
        </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!message.trim()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
