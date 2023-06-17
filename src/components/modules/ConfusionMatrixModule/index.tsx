import React, { useEffect, useState } from "react";
import { Box, ScrollArea, Select, Stack, Text, useMantineTheme } from "@mantine/core";
import { XAxis, YAxis, Tooltip, ScatterChart, CartesianGrid, Scatter, Cell } from 'recharts';
import dataFetchService from "../../../services/DataFetchService";
import { ConfusionMatrixStats, DogBreed, LabelType, } from "../../../services/dataService.type";

const ConfusionMatrixModule = () => {
  const theme = useMantineTheme();
  const [chartData, setChartData] = useState<any[] | undefined>(undefined);
  const [confusionMetrics, setConfusionMetrics] = useState<ConfusionMatrixStats | undefined>(undefined);
  const [dogBreeds, setDogBreeds] = useState<DogBreed[] | undefined>(undefined);
  const [selectedDog, setSelectedDog] = useState<string | null>('');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

  // Retrieve dog breeds from backend
  useEffect(() => {
    if (dogBreeds !== undefined) return;
    dataFetchService.getDogBreeds().then(val => { 
        setDogBreeds(val);
        setSelectedDog(val[0].value)
    })
  }, [dogBreeds]);

  // Retrieve data from backend
  useEffect(() => {
    if (chartData !== undefined) return;
    if(!selectedDog) return;
    dataFetchService.getConfusionMatrixStats(selectedDog).then(val => {
      if (val instanceof Error) return;
      setChartData(
        Object.keys(val.result)
        .filter(label => label !== LabelType.UNLABELLED)
        .filter(label => val.result[label].count > 0)
        .map(label => ( { label, count: val.result[label].count } ))
        .sort((a, b) => b.count - a.count)
      ) 
      setConfusionMetrics(val.CMS); 
    })
  }, [chartData, selectedDog]);


  if (chartData === undefined || Object.keys(chartData).length === 0) {
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

  const onSelectChange = (val: string | null) => {
    setChartData(undefined);
    setSelectedDog(val);
  }

  return (
    <Box
      sx={{
        gap: theme.spacing.xs * 0.5,
        width: '100%',
        height: `50vh`,
        overflow: 'hidden',
      }}>

        <Stack
          sx={{
            gap: theme.spacing.xs * 0.5,
            alignItems: 'center',
            justifyContent: 'stretch',
            height: '100%'
          }}
        >
            <Text sx={{
              fontFamily: 'Noto Sans',
              fontSize: theme.fontSizes.xl,
              color: theme.colors.gray[8],
              fontWeight: 400,
            }}>
              Confusion Matrix - {selectedDog}
            </Text>
            <Select
                label="Dog Breed"
                placeholder="Pick one"
                data={dogBreeds || []}
                value={selectedDog}
                onChange={onSelectChange}
            />
          <ScrollArea 
            type='always'
            style={{ width: '40vw', height: '100%', paddingTop: theme.spacing.md }}>
            <ScatterChart
                width={chartData.length * 60}
                height={270}
                margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid />
                <XAxis dataKey="label" height={90} interval={0} tick={customAxisTick}/>
                <YAxis dataKey="count" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                    content={(props) => 
                        <Box
                            sx={{
                                background: '#ffffff',
                                padding: 8,
                                borderRadius: 4,
                            }}
                        >
                            <Text>Count: {props.payload?.[0]?.payload?.count}</Text>
                            <Box sx={{ margin: '1em 0', borderTop: '1px solid #ccc' }}></Box>
                            <Text>TP: {confusionMetrics?.TP}</Text>
                            <Text>FN: {confusionMetrics?.FN}</Text>
                            <Text>FP: {confusionMetrics?.FP}</Text>
                            <Text>TN: {confusionMetrics?.TN}</Text>
                        </Box>
                    } 
                />
                <Scatter name="count" data={chartData} fill="#8884d8">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Scatter>
                </ScatterChart>
          </ScrollArea>
        </Stack>
    </Box>
  );
}

export default ConfusionMatrixModule;