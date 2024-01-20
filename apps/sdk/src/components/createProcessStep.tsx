import React, { ChangeEvent, FC } from "react";
import { ProcessNode } from "../models/process";

interface CreateProcessStepProps {
  process: ProcessNode;
  onProcessStateChange: (
    nodeId: string,
    stateChange: { [key: string]: string }
  ) => void;
}

const CreateProcessStep: FC<CreateProcessStepProps> = ({
  process,
  onProcessStateChange: onProcessStateChange,
}) => {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    onProcessStateChange(process.nodeId, { [id]: value });
  };

  return (
    <div className="grid">
      <form className="cs1 ce12 grid">
        <div className="form-group-small cs1 ce12">
          <label htmlFor="name">Process name</label>
          <input
            value={process.name}
            onChange={handleInputChange}
            className="input input-small"
            type="text"
            id="name"
            placeholder="Stamping"
          />
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="distribution-2">Type of Distribution</label>
          <select
            value={process.distribution}
            onChange={handleInputChange}
            className="select select-small"
            id="distribution"
          >
            <option value="uniform">Uniform</option>
            <option value="exponential">Exponential</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="cycle_time">Cycle Time</label>

          <span className="input-group">
            <input
              value={process.cycle_time}
              onChange={handleInputChange}
              className="input input-small"
              type="text"
              id="cycle_time"
              placeholder="0"
            />
            <span className="input-decoration">⏱</span>
          </span>
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="min_value">Minimum cycle time</label>

          <span className="input-group">
            <input
              value={process.min_value}
              onChange={handleInputChange}
              className="input input-small"
              type="text"
              id="min_value"
              placeholder="0"
            />
            <span className="input-decoration">⏱</span>
          </span>
        </div>
        
        <div className="form-group-small cs1 ce12">
          <label htmlFor="max_value">Maximum cycle time</label>

          <span className="input-group">
            <input
              value={process.max_value}
              onChange={handleInputChange}
              className="input input-small"
              type="text"
              id="max_value"
              placeholder="0"
            />
            <span className="input-decoration">⏱</span>
          </span>
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="mean_value">Mean cycle time</label>

          <span className="input-group">
            <input
              value={process.mean_value}
              onChange={handleInputChange}
              className="input input-small"
              type="text"
              id="mean_value"
              placeholder="0"
            />
            <span className="input-decoration">⏱</span>
          </span>
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="std_dev">Standard deviation</label>

          <span className="input-group">
            <input
              value={process.std_dev}
              onChange={handleInputChange}
              className="input input-small"
              type="text"
              id="std_dev"
              placeholder="0"
            />
            <span className="input-decoration">⏱</span>
          </span>
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="changeover">Changeover time for the process step</label>

          <span className="input-group">
            <input
              value={process.changeover}
              onChange={handleInputChange}
              className="input input-small"
              type="text"
              id="changeover"
              placeholder="1"
            />
            <span className="input-decoration">⌛</span>
          </span>
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="name">Resource</label>
          <input
            value={process.resource}
            onChange={handleInputChange}
            className="input input-small"
            type="text"
            id="resource"
            placeholder="Resource"
          />
          <p className="p-small">
            Capacity of the resource for the process step
          </p>
        </div>

        <hr />
      </form>

      {/* <button
        onClick={addStep}
        className="cs1 ce6 button button-primary button-small"
      >
        Save process step
      </button> */}
    </div>
  );
};

export default CreateProcessStep;
