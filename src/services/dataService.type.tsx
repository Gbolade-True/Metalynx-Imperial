export interface ConfusionMatrixStats {
    TP: number;
    TN: number;
    FP: number;
    FN: number;
}

export interface Trial {
    CMS: ConfusionMatrixStats,
    result: {
        [label: string]: { count: number }, 
    }
}

export interface DogBreed {
    label: string; 
    value: string; 
}

export enum LabelType {
    UNLABELLED = 'Unlabelled'
}