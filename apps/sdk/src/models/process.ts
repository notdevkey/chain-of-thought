export type ProcessNode = Record<string, any>;

export type Process = ProcessNode | ProcessNode[];

export const ProcessProps = [
  "changeover",
  "cycle_time",
  "distribution",
  "min_value",
  "max_value",
  "mean_value",
  "std_dev",
  "resource",
];

const sample = {
  name: "Name of Process Step 1",
  distribution:
    "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
  cycle_time: "Cycle time (required if distribution is 'fixed')",
  min_value: "Minimum cycle time (required if distribution is 'uniform')",
  max_value: "Maximum cycle time (required if distribution is 'uniform')",
  mean_value:
    "Mean cycle time (required if distribution is 'exponential' or 'normal')",
  std_dev: "Standard deviation (required if distribution is 'normal')",
  changeover: "Changeover time for the process step",
  resource: "Capacity of the resource for the process step",
};

const sampleProcess = [
  {
    name: "Stamping",
    distribution:
      "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
    cycle_time: "Cycle time (required if distribution is 'fixed')",
    min_value: "Minimum cycle time (required if distribution is 'uniform')",
    max_value: "Maximum cycle time (required if distribution is 'uniform')",
    mean_value:
      "Mean cycle time (required if distribution is 'exponential' or 'normal')",
    std_dev: "Standard deviation (required if distribution is 'normal')",
    changeover: "Changeover time for the process step",
    resource: "1",
  },
  {
    name: "Spot Weld",
    distribution:
      "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
    cycle_time: "Cycle time (required if distribution is 'fixed')",
    min_value: "Minimum cycle time (required if distribution is 'uniform')",
    max_value: "Maximum cycle time (required if distribution is 'uniform')",
    mean_value:
      "Mean cycle time (required if distribution is 'exponential' or 'normal')",
    std_dev: "Standard deviation (required if distribution is 'normal')",
    changeover: "Changeover time for the process step",
    resource: "2",
  },
  [
    {
      name: "Inspection",
      distribution:
        "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
      cycle_time: "Cycle time (required if distribution is 'fixed')",
      min_value: "Minimum cycle time (required if distribution is 'uniform')",
      max_value: "Maximum cycle time (required if distribution is 'uniform')",
      mean_value:
        "Mean cycle time (required if distribution is 'exponential' or 'normal')",
      std_dev: "Standard deviation (required if distribution is 'normal')",
      changeover: "Changeover time for the process step",
      resource: "1",
    },
    {
      name: "Another process",
      distribution:
        "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
      cycle_time: "Cycle time (required if distribution is 'fixed')",
      min_value: "Minimum cycle time (required if distribution is 'uniform')",
      max_value: "Maximum cycle time (required if distribution is 'uniform')",
      mean_value:
        "Mean cycle time (required if distribution is 'exponential' or 'normal')",
      std_dev: "Standard deviation (required if distribution is 'normal')",
      changeover: "Changeover time for the process step",
      resource: "1",
    },
  ],
];
