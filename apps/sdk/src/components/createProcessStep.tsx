import React, { ChangeEvent, FC } from "react";
import { ProcessNode } from "../models/process";

interface CreateProcessStepProps {
  process: ProcessNode;
  onProcessStateChange: (key: string, value: string) => void
}

const CreateProcessStep: FC<CreateProcessStepProps> = ({ process, onProcessStateChange: onProcessStateChange }) => {
 
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onProcessStateChange(id, value);
    }


  return (
    <div className="grid">
      <form className="cs1 ce6 grid">
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
          <label htmlFor="ct">Cycle Time (C/T)</label>

          <span className="input-group">
            <span className="input-decoration">seconds</span>
            <input
              value={process.ct}
              onChange={handleInputChange}
              className="input input-small"
              type="number"
              id="ct"
              placeholder="1"
            />
            <span className="input-decoration">⏱</span>
          </span>
        </div>

        <div className="form-group-small cs1 ce12">
          <label htmlFor="co">Changeover (C/O)</label>

          <span className="input-group">
            <span className="input-decoration">hours</span>

            <input
              value={process.co}
              onChange={handleInputChange}
              className="input input-small"
              type="text"
              id="co"
              placeholder="1"
            />
            <span className="input-decoration">⌛</span>
          </span>
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
