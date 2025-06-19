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
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const states = [
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'tamilnadu', label: 'Tamilnadu' },
  { value: 'kerala', label: 'Kerala' },
] as const;

export function AccountDetailsForm(): React.JSX.Element {
  const userState = useSelector((state: RootState) => state.user);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput defaultValue={`${userState.firstName}`} label="First name" name="firstName" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput defaultValue={`${userState.lastName}`} label="Last name" name="lastName" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue={`${userState.email}`} label="Email address" name="email" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput defaultValue={`${userState.phone}`} label="Phone number" name="phone" type="tel" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select defaultValue={`${userState.state}`} label="State" name="state" variant="outlined">
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput defaultValue={`${userState.city}`} label="City" name='city'/>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
}
