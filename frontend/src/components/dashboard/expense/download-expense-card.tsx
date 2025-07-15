'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  Tooltip,
  Chip
} from '@mui/material';
import { FileXlsIcon } from '@phosphor-icons/react';

interface Props {
  fromDate: string;
  toDate: string;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
  onDownloadClick: () => void; 
}

export default function DownloadExpenseCard({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onDownloadClick,
}: Props): React.JSX.Element {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardHeader title="Filter and Export" sx={{ pb: 1 }} />
      <Divider />
      <CardContent sx={{ pt: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="flex-end"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel shrink htmlFor="from-date">From Date</InputLabel>
            <OutlinedInput
              id="from-date"
              type="date"
              notched
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel shrink htmlFor="to-date">To Date</InputLabel>
            <OutlinedInput
              id="to-date"
              type="date"
              notched
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </FormControl>

          <Tooltip title="Download in Excel Format" arrow>
            <Chip
              variant="filled"
              color="success"
              icon={<FileXlsIcon size={20} />}
              label="Download Excel"
              onClick={onDownloadClick}
              sx={{ height: 40, cursor: 'pointer', px: 1.5 }}
            />
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
