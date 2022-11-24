// Import the csv from assets
import { parse } from 'papaparse';

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
}

const dataFetchService = new DataFetchService();
export default dataFetchService;