import { Box, Group, Space, Stack, Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import dataFetchService from "../../../services/DataFetchService";
import { GiArcheryTarget, GiStack } from 'react-icons/gi';
import { IoSkull } from 'react-icons/io5';

const StatisticsModule = () => {
  const theme = useMantineTheme();
  const [data, setData] = useState<
    { accuracy: number, error: number, samples: number} | undefined
  >(undefined);

  // Helper function that calculates the colour to display for the metric
  const calcColorInterp = (value: number, flipColor: boolean = false) => {
    if (flipColor) value = 1 - value;
    const rootHue = [355,  135];
    const rootSL = [0.6, 0.7];
    value = value * value * 140;
    const hue = (value + rootHue[0]) % 360;
    return `hsl(${hue}, ${rootSL[0] * 100}%, ${rootSL[1] * 100}%)`;
  }

  // Decorator that chooses the correct colour based on the metric
  const getMetricBGColor = (metric: string, value: number) => {
    if (metric === 'accuracy') return calcColorInterp(value, false);
    if (metric === 'error') return calcColorInterp(value, true);
    return theme.colors.blue[6];
  }

  // Decorator that chooses the correct icon based on the metric
  const getMetricIcon = (metric: string, size: any) => {
    if (metric === 'accuracy') return <GiArcheryTarget size={size} />;
    if (metric === 'error') return <IoSkull size={size} />;
    if (metric === 'samples') return <GiStack size={size} />
    return <div />
  }

  // Decorator that adds a % sign for decimal numbers
  const getMetricValue = (metric: string, value: number) => {
    if (metric === 'samples') return value;
    return (value * 100 + '').slice(0, 4) + '%';
  }

  // Retrieve data from backend
  useEffect(() => {
    if (data !== undefined) return;
    dataFetchService.getStatistics().then(val => {
      if (val instanceof Error) return;
      else setData(val);
    })
  }, [data]);

  if (data === undefined || data.samples === 0) {
    return (
    <Box sx={{
      gap: theme.spacing.xs * 0.5,
      width: '100%',
      height: `calc(100% - ${theme.spacing.xs}px)`,
      overflow: 'hidden',
    }}>
      Loading...
    </Box>);
  }

  return (
    <Box
      sx={{
        gap: theme.spacing.xs * 0.5,
        width: '100%',
        height: `calc(100% - ${theme.spacing.xs}px)`,
        overflow: 'hidden',
      }}>
        <Stack
          sx={{
            gap: theme.spacing.xs * 0.5,
            alignItems: 'center',
            justifyContent: 'stretch',
            height: '100%'
          }}>
            <Group 
              dir="row" 
              noWrap 
              sx={{ 
                gap: theme.spacing.xl, 
                justifyContent: 'space-evenly',
                height: '100%'
              }}>
              {Object.entries(data).map(([metric, value], index) => (
                <Stack
                  key={`stat-module-${metric}-card-${index}`}
                  sx={{
                    gap: 0,
                    backgroundColor: getMetricBGColor(metric, value),
                    borderRadius: theme.radius.sm,
                    color: theme.white,
                    width: '13vw',
                    height: `80%`,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {getMetricIcon(metric, theme.fontSizes.xl * 3)}
                    <Text
                      transform="capitalize"
                      sx={{
                        fontSize: theme.fontSizes.lg,
                        fontFamily: 'Noto Sans',
                        fontWeight: 600,
                        opacity: 0.9
                      }}>
                      {metric}
                    </Text>
                    <Space h='xs'/>
                    <Group dir="row" noWrap sx={{ gap: theme.spacing.xs * 0.2, alignItems: 'end' }}>
                      <Text
                        weight={600}
                        sx={{
                          fontSize: `calc(2.2vw)`,
                          fontFamily: 'Noto Sans',
                          lineHeight: 1.1,
                        }}>
                        {getMetricValue(metric, value)}
                      </Text>
                    </Group>
                </Stack>
              ))}
            </Group>
        </Stack>
    </Box>
  );
}

export default StatisticsModule;