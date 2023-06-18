import React from 'react'
import { MantineProvider } from '@mantine/core';
import { render, waitFor, screen } from '@testing-library/react'
import MLMetricsModule from '../../components/modules/MLMetricsModule';
import dataFetchService from '../../services/DataFetchService';

jest.spyOn(global, 'fetch').mockReturnValue(
	Promise.resolve({
		text: () => Promise.resolve(dataFetchService.csvString)
	} as unknown as Response)
)

describe('ML Metric Module', () => {
	beforeEach(() => {
		jest.spyOn(dataFetchService, 'getDogBreeds')
		.mockReturnValue(Promise.resolve(
			[
				{ label: 'Chihuahua', value: 'Chihuahua' },
			])
		) 
		jest.spyOn(dataFetchService, 'getConfusionMatrixStats')
		.mockReturnValue(Promise.resolve(
			{    
				CMS: { TP: 80, TN: 3, FP: 25, FN: 11 },
				result: {
					Chihuahua: { count: 10 }
				}
			}
		))
	})

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders properly', async () => {
		render(
			<MantineProvider>
				<MLMetricsModule />
			</MantineProvider>
		)
		await waitFor(() => new Promise((res) => setTimeout(res, 600)))
		expect(screen.getByText('ML Metrics - Chihuahua')).toBeInTheDocument()
	})

	it('gets dog breeds correctly', async () => {
		render(
			<MantineProvider>
				<MLMetricsModule />
			</MantineProvider>
		)
		await waitFor(() => new Promise((res) => setTimeout(res, 600)))
		expect(screen.getByLabelText('Dog Breed')).toBeInTheDocument()
	})

	it('gets confusion matrix stats correctly', async () => {
		const {container} = render(
			<MantineProvider>
				<MLMetricsModule />
			</MantineProvider>
		);
		await waitFor(() => new Promise((res) => setTimeout(res, 600)))
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const radarChartContainer  = container.getElementsByClassName('recharts-responsive-container')
		expect(radarChartContainer.length).toBe(1)
	})
})
