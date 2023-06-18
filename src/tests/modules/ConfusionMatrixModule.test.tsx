import React from 'react'
import { MantineProvider } from '@mantine/core';
import { render, waitFor, screen } from '@testing-library/react'
import MLMetricsModule from '../../components/modules/MLMetricsModule';
import dataFetchService from '../../services/DataFetchService';
import ConfusionMatrixModule from '../../components/modules/ConfusionMatrixModule';

jest.spyOn(global, 'fetch').mockReturnValue(
	Promise.resolve({
		text: () => Promise.resolve(dataFetchService.csvString)
	} as unknown as Response)
)

describe('Confusion Matrix Module', () => {
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
				<ConfusionMatrixModule />
			</MantineProvider>
		)
		await waitFor(() => new Promise((res) => setTimeout(res, 600)))
		expect(screen.getByText('Confusion Matrix - Chihuahua')).toBeInTheDocument()
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
})
