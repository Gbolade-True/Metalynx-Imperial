import { Box, Grid, Group, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core";
import { useId } from "@mantine/hooks";

import { IModule } from "../../components/modules/modules.type";
import ClassificationModule from "../../components/modules/ClassificationBarModule";
import StatisticsModule from "../../components/modules/StatisticsModule";
import ConfisionMatrixModule from "../../components/modules/ConfusionMatrixModule";
import MLMetricsModule from "../../components/modules/MLMetricsModule";


const DashboardLayout = (() => {
  const theme = useMantineTheme();

  // TODO: Add your modules here
  const modules: IModule[] = [
    { id: useId(), name: 'Statistics', component: StatisticsModule, width: 'half' },
    { id: useId(), name: 'Classification', component: ClassificationModule, width: 'half' },
    { id: useId(), name: 'Confusion Matrix', component: ConfisionMatrixModule, width: 'half' },
    { id: useId(), name: 'ML Metrics', component: MLMetricsModule, width: 'half' },
  ];

  return (
    <Box sx={{ flexGrow: 3, width: '100%', overflow: 'hidden', marginTop: theme.spacing.xs }}>
      <ScrollArea sx={{ width: '100%', height: '100%' }}>
        <Grid
          justify="flex-start"
          align="flex-start"
          sx={{
            width: `calc(100% - ${theme.spacing.xs}px)`,
            marginLeft: theme.spacing.xs * 0.5,
            gap: 0,
          }}>
          {modules.map((m) => (
            <Grid.Col 
              key={'grid-module-' + m.id} 
              span={m.width === 'half' ? 6 : 12} 
              sx={{ height: theme.spacing.xl * 15 }}>
              <m.component />
            </Grid.Col>
          ))}
        </Grid>
      </ScrollArea>
    </Box>
  );
});

const DashboardPage = () => {
  const theme = useMantineTheme();
  return (
    <Stack
      sx={{
        flexGrow: 3,
        minHeight: '100vh',
        height: '100%',
        minWidth: `calc(100vw - ${theme.fontSizes.md * 5}px)`,
        width: '100%',
        gap: 0,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        backgroundColor: theme.colors.gray[2]
      }}>
      <Group
        dir="row"
        noWrap
        sx={{
          width: `calc(100% - ${theme.spacing.xl * 4 - (theme.fontSizes.xl + theme.spacing.lg)}px)`,
          marginLeft: theme.spacing.xl * 3 - (theme.fontSizes.xl + theme.spacing.lg),
          gap: theme.spacing.md,
        }}>
        <Stack sx={{ gap: 0, flexGrow: 0 }}>
          <Text sx={{ 
            fontFamily: 'Noto Sans', 
            fontSize: theme.fontSizes.lg * 2,
            letterSpacing: 0,
            color: theme.black, 
            fontWeight: 700
          }}>
            Data Analysis Dashboard
          </Text>
          <Text sx={{
            fontFamily: 'Noto Sans',
            fontSize: theme.fontSizes.xl,
            color: theme.colors.gray[8],
            fontWeight: 300,
            marginLeft: theme.spacing.xs * 0.2
          }}>
            Stanford Dogs Classification Dataset
          </Text>
        </Stack>
      </Group>
      <DashboardLayout />
    </Stack>
  );
}

export default DashboardPage;