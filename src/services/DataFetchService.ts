// Import the csv from assets
import { parse } from 'papaparse';
import { ConfusionMatrixStats, DogBreed, LabelType, CMSResponse, MLMetricsResponse } from './dataService.type';

export interface DataFetchServiceAPI {
  getStatistics(): Promise<{ accuracy: number, error: number, samples: number } | Error>;
}

class DataFetchService implements DataFetchServiceAPI {
  dataset: { [fieldNames: string]: any[] } = {};

  constructor() {
    this.fetchCSVData().then(res => this.dataset = res.data);
  }

  private async checkData(): Promise<boolean> {
    const checkDataExists = () => Object.keys(this.dataset).length > 0;
    if (checkDataExists()) return new Promise(res => res(true));
    return new Promise((res, rej) => {
      const invervalID = setInterval(() => {
        if(checkDataExists()) {
          clearInterval(invervalID);
          res(true);
        }
      }, 100);
    })
  }

  private async fetchCSVData(filename: string = 'stanford_dogs.csv'): 
  Promise<{ data: { [fieldName: string]: any }, errors: any[], meta: any }> {
    return fetch(`${process.env.PUBLIC_URL}/data/${filename}`)
    .then(res => res.text())
    .then(csvString => {
      const results = parse(csvString, {
        header: true, 
        dynamicTyping: true,
      });

      const reformattedData: { [fieldName: string]: any[] } = {};
      results.data
      .forEach((row: any) => Object.keys(row)
      .forEach(fieldName => {
        if (reformattedData[fieldName] === undefined) reformattedData[fieldName] = [];
        reformattedData[fieldName].push(row[fieldName]);
      }));

      return { data: reformattedData, errors: results.errors, meta: results.meta };
    });
  }

  async getStatistics(): Promise<{ accuracy: number; error: number; samples: number; } | Error> {
    await this.checkData();
    
    // Field Names
    const labelField = 'Labels';
    const predictionField = 'Predictions';

    let correctEntries = 0;
    let wrongEntries = 0;

    for (let i = 0; i < this.dataset[labelField].length; i++) {
      if (this.dataset[labelField][i] === this.dataset[predictionField][i]) {
        correctEntries++;
      } else {
        wrongEntries++;
      }
    }

    const total = correctEntries + wrongEntries;
    return { accuracy: correctEntries / total, error: wrongEntries / total, samples: total };
  }

  async getClassifications(): Promise<{ [classname: string]: { correct: number, incorrect: number }}> {
    await this.checkData();

    const result: { [classname: string]: { correct: number, incorrect: number }} = {};

    // Field Names
    const labelField = 'Labels';
    const predictionField = 'Predictions';

    for (let i = 0; i < this.dataset[labelField].length; i++) {
      const currentLabel = this.dataset[labelField][i];
      const currentPred = this.dataset[predictionField][i];
      if (result[currentLabel] === undefined) result[currentLabel] = { correct: 0, incorrect: 0 }
      if (currentLabel === currentPred) result[currentLabel].correct += 1;
      else result[currentLabel].incorrect += 1;
    }

    return result;
  }

  async getDogBreeds(): Promise<DogBreed[]> {
    await this.checkData();

    const labelField = 'Labels';

    let dogBreeds = this.dataset[labelField]
    .filter(label => label !== LabelType.UNLABELLED)

    dogBreeds = [...new Set(dogBreeds)]
    .map(breed => ({
      label: breed,
      value: breed
    } as DogBreed))

    return dogBreeds
  }

  async getConfusionMatrixStats(dogBreed: string): Promise<CMSResponse | Error> {
    await this.checkData();

    let result: { [label: string]: { count: number } } = {};
    
    // Field Names
    const labelField = 'Labels';
    const predictionField = 'Predictions';
    const accuracyField = 'Accuracy';

    let TP = 0;
    let FP = 0;
    let TN = 0;
    let FN = 0;

    for (let i = 0; i < this.dataset[labelField].length; i++) {
      const currentLabel = this.dataset[labelField][i];
      const currentPred = this.dataset[predictionField][i];
      const currentAccuracy = this.dataset[accuracyField][i];

      if (result[currentLabel] === undefined) result[currentLabel] = { count: 0 }

      if (currentLabel === dogBreed) {
        result[currentPred].count += 1

        // Calculate True Positives - If the label is the breed and the prediction is the breed, it is a True Positive
        if (currentLabel === currentPred) {
          TP += 1;
          continue;
        } 

        // Calculate False Negatives - If the label is the breed and the prediction is not the breed, it is a False Negative
        if (currentLabel !== currentPred) {
          FN += 1;
          continue;
        } 
      } else {
        // Calculate True Negatives - If label is not the dog breed and the prediction aligns with the label
        // Some logical tweaks to make this work in this context, to handle correct predictions on unlabelled data
        if (currentPred === dogBreed && currentAccuracy === 1) {
          TN += 1;
          continue;
        } 

        // Calculate False Positives - If the label is not the breed and prediction is the breed it is a False Positive
        if (currentPred === dogBreed) {
          FP += 1;
          continue;
        } 
      }
    }
  
    return {
      result,
      CMS: {
        TP, TN, FN, FP
      }
    };
  }

  async calculateMetrics(metrics: ConfusionMatrixStats): Promise<MLMetricsResponse | Error> {

    const accuracy = (metrics['TP'] + metrics['TN']) / (metrics['TP'] + metrics['TN'] + metrics['FP'] + metrics['FN'])
    const precision = metrics['TP'] / (metrics['TP'] + metrics['FP'])
    const recall = metrics['TP'] / (metrics['TP'] + metrics['FN'])
    const specificity =  metrics['TN'] / (metrics['TN'] + metrics['FP'])
    const f1_score = 2*precision*recall / (precision + recall)
  
    return {
      accuracy,
      precision,
      recall,
      specificity,
      f1_score
    };
  }
}

const dataFetchService = new DataFetchService();
export default dataFetchService;