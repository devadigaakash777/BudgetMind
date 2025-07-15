'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { neonBlue } from '@/styles/theme/colors';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';
import { Box } from '@mui/system';
import { WalletIcon } from '@phosphor-icons/react/dist/ssr'

import { Chart } from '@/components/core/chart';

export interface WalletChartProps {
  chartSeries: number[];
  labels: string[];
  sx?: SxProps;
}

export function WalletChart({ chartSeries, labels, sx }: WalletChartProps): React.JSX.Element {
  //Chart color
  const paletteMapping = [
    neonBlue[300],
    neonBlue[400],
    neonBlue[500],
    neonBlue[600],
    neonBlue[700],
    neonBlue[800],
  ];
  const chartOptions = useChartOptions(labels, paletteMapping);

  return (
    <Card sx={sx}>
      <CardHeader title="Amount Distribution" />
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <Stack spacing={2}>
            <Chart
              height={300}
              width="100%"
              options={chartOptions}
              series={chartSeries}
              type="donut"
            />
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap', // important: so items wrap on small screens
              }}
            >
              {chartSeries.map((item, index) => {
                const label = labels[index];
                const color = paletteMapping[index];

                return (
                  <Stack key={label} spacing={1} sx={{ alignItems: 'center' }}>
                    <WalletIcon size={24} weight='fill' color={color} />
                    <Typography variant="h6">{label}</Typography>
                    <Typography color="text.secondary" variant="subtitle2">
                      ₹{item}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[], paletteMapping: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', toolbar: { show: false } },
    colors: paletteMapping,
    dataLabels: { enabled: true },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => `₹ ${value}`,
        title: {
          formatter: (label) => `${label}`,
        },
      },
    },
  };
}
