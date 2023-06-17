import React, { useEffect, useState } from "react";
import { Box, Select, Stack, Text, useMantineTheme } from "@mantine/core";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import dataFetchService from "../../../services/DataFetchService";
import { DogBreed, MLMetricsResponse, } from "../../../services/dataService.type";

const MLMetricsModule = () => {
  const theme = useMantineTheme();
  const [chartData, setChartData] = useState<{ label: string; value: number; fullMark: number }[] | undefined>(undefined);
  const [dogBreeds, setDogBreeds] = useState<DogBreed[] | undefined>(undefined);
  const [selectedDog, setSelectedDog] = useState<string | null>('');

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
    dataFetchService.getConfusionMatrixStats(selectedDog)
    .then(val => {
      if (val instanceof Error) return;
      dataFetchService.calculateMetrics(val.CMS)
      .then(val => {
        if (val instanceof Error) return;
        setChartData(
            Object.keys(val)
            .map(label => ( { label, value: val[label as keyof MLMetricsResponse], fullMark: 100}))
        )
      })
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
              ML Metrics - {selectedDog}
            </Text>
            <Select
                label="Dog Breed"
                placeholder="Pick one"
                data={dogBreeds || []}
                value={selectedDog}
                onChange={onSelectChange}
            />
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <Tooltip />
                    <PolarGrid />
                    <PolarAngleAxis dataKey="label" />
                    <PolarRadiusAxis />
                    <Radar name={selectedDog!} dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
        </Stack>
    </Box>
  );
}

export default MLMetricsModule;