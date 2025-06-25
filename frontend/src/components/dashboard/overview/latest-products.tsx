import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { TrashIcon,ShoppingCartIcon } from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import RouterLink from 'next/link';
import { paths } from '@/paths';


export interface Product {
  id: string;
  image: string;
  name: string;
  cost: string;
  savedAmount: string;
}

export interface LatestProductsProps {
  products?: Product[];
  sx?: SxProps;
}

export function LatestProducts({ products = [], sx }: LatestProductsProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Latest products" />
      <Divider />
      <List>
        {products.map((product, index) => (
          <ListItem divider={index < products.length - 1} key={product.id}>
            <ListItemAvatar>
              {product.image ? (
                <Box component="img" src={product.image} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
              ) : (
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-200)',
                    height: '48px',
                    width: '48px',
                  }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={product.name}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={
              <>
                Cost: ₹{product.cost}
                <br />
                Saved Amount: ₹{product.savedAmount}
              </>
              }
              secondaryTypographyProps={{ variant: 'body2' }}
            />
            <Button component={RouterLink} href={paths.dashboard.wishlists} color="error" endIcon={<TrashIcon fontSize="var(--icon-fontSize-md)" />} size="small" />
            <Button component={RouterLink} href={paths.dashboard.wishlists} color="success" endIcon={<ShoppingCartIcon fontSize="var(--icon-fontSize-md)" />} size="small" />
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
          component={RouterLink} 
          href={paths.dashboard.wishlists}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
