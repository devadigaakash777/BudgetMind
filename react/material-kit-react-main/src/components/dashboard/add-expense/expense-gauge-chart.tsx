'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/system';
import { InfoIcon } from '@phosphor-icons/react/dist/ssr';
import { CircleIcon } from '@phosphor-icons/react/dist/ssr';

type GaugeLimit = { value: number; label?: string };

type GaugeChartProps = {
  list: Record<string, GaugeLimit>;
  value: number;
  title?: string;
};

export default function GaugeChart({
  list,
  value,
  title = 'Gauge Chart'
}: GaugeChartProps): React.JSX.Element {
  const theme = useTheme();

  const entries = React.useMemo(
    () => Object.entries(list).sort((a, b) => a[1].value - b[1].value),
    [list]
  );

  const max = entries[entries.length - 1]?.[1].value ?? 100;
  const percent = Math.min((value / max) * 100, 100);

  const colorList = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.warning.dark,
    theme.palette.error.main
  ];

  let color = colorList[colorList.length - 1];
  let matchedLabel = entries[entries.length - 1]?.[0] ?? '';

  for (let i = 0; i < entries.length; i++) {
    if (value <= entries[i][1].value) {
      color = colorList[i] ?? colorList[colorList.length - 1];
      matchedLabel = entries[i][0];
      break;
    }
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Stack spacing={2} alignItems="center">
          {/* CircularProgress (native) */}
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={percent}
              size={200}
              thickness={5}
              sx={{
                color
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h4" component="div" color="text.primary">
                {value}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {matchedLabel}
              </Typography>
            </Box>
          </Box>

          {/* Limits with Tooltip (keep your part exactly) */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {entries.map(([key, gauge], index) => {
              const entryColor =
                colorList[index] ?? colorList[colorList.length - 1];
              return (
                <Stack key={key} spacing={0.5} alignItems="center">
                  <CircleIcon size={14} weight="fill" color={entryColor} />
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body2">{key}</Typography>
                    {gauge.label && (
                      <Tooltip title={gauge.label} placement="top" arrow>
                        <Box
                          sx={{
                            cursor: 'pointer',
                            color: 'text.secondary',
                            display: 'flex'
                          }}
                        >
                          <InfoIcon size={16} weight="regular" />
                        </Box>
                      </Tooltip>
                    )}
                  </Stack>
                  <Typography color="text.secondary" variant="caption">
                    {gauge.value}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
