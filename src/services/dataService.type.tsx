export interface ConfusionMatrixStats {
    TP: number;
    TN: number;
    FP: number;
    FN: number;
}

export interface CMSResponse {
    CMS: ConfusionMatrixStats,
    result: {
        [label: string]: { count: number }, 
    }
}
export interface MLMetricsResponse {
    accuracy: number;
    precision: number;
    recall: number;
    specificity: number;
    f1_score: number;
}

export interface DogBreed {
    label: string; 
    value: string; 
}

export enum LabelType {
    UNLABELLED = 'Unlabelled'
}