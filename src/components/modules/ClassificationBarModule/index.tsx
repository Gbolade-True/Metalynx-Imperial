import { Box, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import dataFetchService from "../../../services/DataFetchService";

const ClassificationModule = () => {
  const theme = useMantineTheme();
  const [data, setData] = useState<
  { name: string, correct: number, incorrect: number }[] | undefined
  >(undefined);

  // Retrieve data from backend
  useEffect(() => {
    if (data !== undefined) return;
    dataFetchService.getClassifications().then(val => {
      if (val instanceof Error) return;
      else setData(
        Object.keys(val)
        .filter(name => name !== 'Unlabelled')
        .map(name => ({ name, ...val[name] })));
    })
  }, [data]);

  if (data === undefined || Object.keys(data).length === 0) {
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

  const customAxisTick = (props: React.PropsWithoutRef<any>) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text fontSize={12} x={0} y={0} dy={10} textAnchor="end" fill="#666" transform="rotate(-40)">
          {payload.value}
        </text>
      </g>
    );
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
            <Text sx={{
              fontFamily: 'Noto Sans',
              fontSize: theme.fontSizes.xl,
              color: theme.colors.gray[8],
              fontWeight: 400,
            }}>
              Results by Class
            </Text>
          <ScrollArea 
            type='always'
            style={{ width: '40vw', height: '100%', paddingTop: theme.spacing.md }}>
            <BarChart
              width={data.length * 30}
              height={270}
              data={data}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" height={90} interval={0} tick={customAxisTick} />
              <YAxis />
              <Tooltip  />
              <Bar dataKey="correct" stackId="a" fill="#009951" />
              <Bar dataKey="incorrect" stackId="a" fill="#9f1f18" />
            </BarChart>
          </ScrollArea>
        </Stack>
    </Box>
  );
}

export default ClassificationModule;