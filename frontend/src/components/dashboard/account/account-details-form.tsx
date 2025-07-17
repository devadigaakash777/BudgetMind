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
import Select, { SelectChangeEvent } from '@mui/material/Select';


export const states = [
  { value: 'andhra_pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal_pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal_pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil_nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west_bengal', label: 'West Bengal' },

  // Union Territories
  { value: 'andaman_nicobar', label: 'Andaman and Nicobar Islands' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'dadra_nagar_haveli_daman_diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'jammu_kashmir', label: 'Jammu and Kashmir' },
  { value: 'ladakh', label: 'Ladakh' },
  { value: 'lakshadweep', label: 'Lakshadweep' },
  { value: 'puducherry', label: 'Puducherry' },
] as const;


export type AccountDetailsFormProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  state?: string;
  city?: string;
  onSave?: (values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    state: string;
    city: string;
  }) => void;
};

export function AccountDetailsForm({
  firstName = '',
  lastName = '',
  email = '',
  phone = '',
  state = '',
  city = '',
  onSave,
}: AccountDetailsFormProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    firstName,
    lastName,
    email,
    phone,
    state,
    city,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

   return (
    <form onSubmit={handleSubmit}>
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
                <OutlinedInput
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  label="First name"
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
                <InputLabel>Last name</InputLabel>
                <OutlinedInput
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  label="Last name"
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
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  label="Email address"
                />
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
                <OutlinedInput
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  label="Phone number"
                  type="tel"
                />
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
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleSelectChange}
                  label="State"
                  variant="outlined"
                >
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
                <OutlinedInput
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  label="City"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
