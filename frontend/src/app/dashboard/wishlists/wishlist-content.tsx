'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import  AddWishlistModal from '@/components/dashboard/wishlists/wishlist-model'
import { WishlistCard } from '@/components/dashboard/wishlists/wishlist-card';
import { CompaniesFilters } from '@/components/dashboard/wishlists/integrations-filters';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  thunkAddWishlistItem,
  thunkDeleteWishlistItem,
  thunkIncreaseMonth,
  thunkDecreaseMonth,
  thunkChangePriority,
  thunkBuyItem,
} from '@/redux/thunks/wishlist-thunks';
import { setPage } from '@/redux/slices/wishlist-slice';

import { useEffect } from 'react';
import { clearPreview } from '@/redux/slices/preview-slice';

export default function WishlistContent(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const wishlists = wishlist.items; 
  

  //clear the preview to reflect any changes happened in this component
  useEffect(() => {
    dispatch(clearPreview()); 
  }, [dispatch]);


  // Pagination logic
  const { items, page, rowsPerPage } = wishlist;

  const paginatedItems = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(items.length / rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Wishlist</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Add
          </Button>
        </div>
        <AddWishlistModal
          open={open}
          onClose={handleClose}
          onAdd={(item) => {
            dispatch(thunkAddWishlistItem(item));
          }}
          maxPriority={wishlists.length > 0 ? Math.max(...wishlists.map(i => i.priority)) : 0}
        />
      </Stack>
      <CompaniesFilters />
      <Grid container spacing={3}>
        {paginatedItems.map((wishlist) => (
          <Grid
            key={wishlist._id}
            size={{
              lg: 4,
              md: 6,
              xs: 12,
            }}
          >
            <WishlistCard
              item={wishlist}
              onDelete={(id) => dispatch(thunkDeleteWishlistItem(id))}
              onIncreaseMonth={(id) => dispatch(thunkIncreaseMonth(id))}
              onDecreaseMonth={(id) => dispatch(thunkDecreaseMonth(id))}
              onBuy={(id) => dispatch(thunkBuyItem(id))}
              onIncreasePriority={(id) =>
                dispatch(thunkChangePriority({ id, newPriority: wishlist.priority + 1 })) // Example logic: +1 priority
              }
              onDecreasePriority={(id) =>
                dispatch(thunkChangePriority({ id, newPriority: (wishlist.priority > 1) ? wishlist.priority - 1 : wishlist.priority })) // Example logic: +1 priority
              }
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(e, value) => dispatch(setPage(value - 1))}
          size="small"
        />
      </Box>
    </Stack>
  );
}
