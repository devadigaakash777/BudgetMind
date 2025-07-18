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
import {
  SmileyIcon,
  SmileyMehIcon,
  SmileySadIcon,
  WarningIcon,
  WarningCircleIcon,
  XCircleIcon,
  InfoIcon, 
  CircleIcon,
} from '@phosphor-icons/react/dist/ssr';

import { adjustGaugeList } from '@/utils/adjust-gauge-list'


type GaugeLimit = { value: number; label?: string };

type GaugeChartProps = {
  setCanSave: () => void;
  setCanNotSave: () => void;
  list: Record<string, GaugeLimit>;
  dailyBudget: number,
  days: number;
  value: number;
  title?: string;
};

export default function GaugeChart({
  setCanSave,
  setCanNotSave,
  list,
  days,
  value,
  title = 'Gauge Chart'
}: GaugeChartProps): React.JSX.Element {
  const theme = useTheme();

  list = adjustGaugeList(list, days);

  React.useEffect(() => {
    if (list['Spending Wallet'].value >= value) {
      setCanSave();
    } else {
      setCanNotSave();
    }
  }, [list, value, setCanSave, setCanNotSave]); 


  const entries = React.useMemo(
    () => Object.entries(list).sort((a, b) => a[1].value - b[1].value),
    [list]
  );

  const max = entries.at(-1)?.[1].value ?? 100;;
  const percent = Math.min((value / max) * 100, 100);

  const colorList = [
    theme.palette.primary.main,
    theme.palette.success.dark,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.warning.dark,
    theme.palette.error.main,
    theme.palette.error.dark,
  ];

  let color = colorList.at(-1)!;
  let matchedLabel = entries.at(-1)?.[0] ?? '';
  let message = entries.at(-1)?.[1].label ?? 'Unable To Track';

  for (const [index, [label, gauge]] of entries.entries()) {
    if (value <= gauge.value) {
      color = colorList.at(index) ?? colorList.at(-1)!;
      matchedLabel = label;
      message = gauge.label ?? 'Unable To Track';
      break;
    }
  }


  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        {/* Matched Status Indicator (Above CircularProgress) */}
        <Stack spacing={1} 
            alignItems="center"
            sx={{
              p: 2,
              borderRadius: 2,
              mb: 2,
              border: '1px solid',
              borderColor: { color }
            }}
        >
          <Box sx={{ color }}>
            {matchedLabel === 'Good' && <SmileyIcon size={32} weight="fill" />}
            {matchedLabel === 'Slightly over' && <SmileyMehIcon size={32} weight="fill" />}
            {matchedLabel === 'Spending Wallet' && <WarningIcon size={32} weight="fill" />}
            {matchedLabel === 'Savings Access' && <SmileySadIcon size={32} weight="fill" />}
            {matchedLabel === 'High Risk' && <WarningCircleIcon size={32} weight="fill" />}
            {matchedLabel === 'Impossible' && <XCircleIcon size={32} weight="fill" />}
          </Box>
          <Typography variant="subtitle1" sx={{ color: '#000000' }}>
            {message}
          </Typography>
        </Stack>
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
              const entryColor = colorList[index] ?? colorList.at(-1);
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
