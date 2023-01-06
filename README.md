# Metalynx Imperial Take Home Exercise 2023
## Introduction

This repository is a React SPA app that represents a dashboard in which computes several statistics of a given CSV dataset. The provided dataset is the [Stanford Dogs Dataset](https://www.kaggle.com/datasets/jessicali9530/stanford-dogs-dataset) dataset trained for dog breed classification on MobileNetV3, and the goal of this webapp is to display insights from these results.

The project should take no longer than 3 hours to complete. If you've not had experience with some of the technologies above and you'd like to spend more time, take as long as you need. There are no restrictions for the use of external libraries.

## Objectives

The objective for this test is to implement two additional modules which can further provide insights into the performance of the machine learning classifier. 

- The first module should be a [Confusion Matrix](https://en.wikipedia.org/wiki/Confusion_matrix) for all 120 dog classes. Think of a thoughtful way of presenting the data. 
- The second module is up to the candidate, and potential modules include: Sensitivity/Specificity/Precision/F1-score matrix, Histograms of demographics, Scalar-Binned Histograms, AUROC curves, Brier Score graphs, PR curves, etc. Feel free to explore ideas outside of this list, and look up common Machine Learning analysis metrics on Wikipedia and beyond. Try to think of a use case for this module.

#### Tips!

> An initial module (`frontend/src/components/modules/StatisticsModule`), which calculates and reports the count, accuracy and error of the dataset, is present in the repository to serve as an example of what the entire full stack implementation would look like, and a `TODO` comment has been added to indicate where your module component should be injected.

Some additional requirements/considerations are:

- Please initialise and implement this with Git. The current style we follow is to prefix each commit message with `[Feature]`, `[Fix]`, `[Refactor]` (e.g. `[Feature] Add DICOM viewer module to frontend`), and small short-lived branches for each feature.
- Testing **can be omitted** from the repository, if there isn't enough time.
- There are no restrictions in modifying any of the files, so feel free to change the repository to accommodate your new module.

## Structure

This repository is currently arranged as:

```
├─ public/                            // Static files to be used after the final webpack of the frontend React codebase
│  ├─ stanford_dogs.csv               // The source CSV used to get the output results
├─ src/
│  ├─ assets/                         // Static assets to be used in 'src' such as fonts and logos
│  ├─ components/                     // Small, 'reusable' components should live here
│  │  ├─ modules/                     // Where your dashboard module code should live, currently has the 'Statistics' module
│  │  ├─ navbar/                      // The Navbar component lives here
│  ├─ containers/                     // Where pages should live, currently has the Dashboard page
│  ├─ services/
│  │  ├─ DataFetchService.ts          // The service which reads and processes data from the CSV
├─ package.json                       // npm-workspace submodule for the frontend code
```

The key libraries and technologies we use with a link to their documentation:

- [mantine](https://mantine.dev/) - The frontend component framework used to design the initial dashboard components

## Getting Started Locally

#### Step 0: Install pre-requisites

(Hint: Use [nvm](https://github.com/nvm-sh/nvm) for node version control)

Node.js version 16+ (Currently using v16.x.x)

```
➜  metalynx-scatter git:(main) node --version
v16.14.2
```

npm version 8+ (Currently using v8.1.x)

```
➜  metalynx-scatter git:(main) npm --version
8.18.0
```

#### Step 2: Install packages

```
➜  metalynx-scatter git:(main) npm i
added 1816 packages, and audited 1819 packages in 47s.
```

(Yes there might be warnings about deprecated packages, most of these should be dev script deprecations which are not used in production).

#### Step 3: Start the development server

```
➜  metalynx-scatter git:(main) npm run dev
```

This should start up the React development servers, and their ports are printed on stdout.

```
...
[frontend] You can now view frontend in the browser.
[frontend] 
[frontend]   Local:            http://localhost:3000
[frontend]   On Your Network:  http://172.25.197.36:3000
```

Wait for the `Compiled successfully!` message, and then you can open your browser and go to `localhost:3000` to view the SPA.

## Troubleshooting

#### I can't use port X because it's already being used by some other application?

Updating the frontend ports (development):

- You will have to update the `PORT` environment externally, which is: `export PORT=4000` for OSX/Linux and `set PORT=4000` for Windows.

#### For any other issues, feel free to email me at justin@meta-lynx.com and I'll try to get back to you ASAP. Good luck on the test.