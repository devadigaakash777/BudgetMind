import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CloudArrowUpIcon } from '@phosphor-icons/react/dist/ssr';

type AccountInfoProps = {
  name?: string;
  avatar?: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  timezone?: string;
  onAdd: (item: string) => void;
};

export function AccountInfo({
  name = "User1",
  avatar = '',
  jobTitle = 'Developer',
  city = '',
  country = '',
  timezone = '',
  onAdd,
}: AccountInfoProps): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{name}</Typography>
            <Typography variant="h3">{jobTitle}</Typography>
            <Typography color="text.secondary" variant="body2">
              {city} {country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {timezone}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          component="label"
          role={undefined}
          variant="outlined"
          startIcon={<CloudArrowUpIcon />}
        >
          Upload picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                const imageURL = URL.createObjectURL(file);
                onAdd(imageURL);
              }
            }}
          />
        </Button>
      </CardActions>
    </Card>
  );
}
