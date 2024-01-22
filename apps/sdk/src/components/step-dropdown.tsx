import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSteps } from "../stores/steps.store";
import {
  ProcessSchema,
  QueueSchema,
  distribution,
  processSchema,
  queueSchema,
} from "./tabs/process";

interface Props {
  id: string;
  name: string;
  isExpanded: boolean;
  onExpandedChange(): void;
}

export default function StepDropdown({
  id,
  name,
  isExpanded,
  onExpandedChange,
}: Props) {
  const { updateStep, steps } = useSteps();

  const currentStep = useMemo(
    () => steps.find((step) => step.id === id),
    [steps]
  );

  const {
    register: registerProcess,
    handleSubmit: handleSubmitProcess,
    formState: { errors: processErrors },
  } = useForm<ProcessSchema>({
    resolver: zodResolver(processSchema),
    defaultValues: currentStep,
  });

  const {
    register: registerQueue,
    handleSubmit: handleSubmiQueue,
    formState: { errors: queueErrors },
  } = useForm<QueueSchema>({
    resolver: zodResolver(queueSchema),
    defaultValues: currentStep,
  });

  return (
    <div
      className="cs1 ce12"
      style={{
        padding: "12px",
        background: "#f7f7f7",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={onExpandedChange}
      >
        <p style={{ fontWeight: "bold", margin: 0, fontSize: "14px" }}>
          {name}
        </p>
        <ChevronRight
          style={{
            width: "30px",
            height: "30px",
            color: "#dddddd",
            transitionDuration: "0.2s",
            rotate: isExpanded ? "90deg" : "0deg",
          }}
        />
      </div>
      {isExpanded && currentStep?.type === "Process step" && (
        <>
          <div
            style={{ marginTop: "20px" }}
            className={`form-group-small ${processErrors.name && "error"}`}
          >
            <label htmlFor="name">Name</label>
            <input
              className="input input-small"
              id="name"
              {...registerProcess("name")}
            />

            {processErrors.name && (
              <p className="var(--red600)">{processErrors.name.message}</p>
            )}
          </div>
          <div
            className={`form-group-small ${
              processErrors.cycle_time && "error"
            }`}
          >
            <label htmlFor="distribution">Cycle Time Distribution</label>
            <select
              {...registerProcess("distribution")}
              className="select select-small"
              aria-placeholder="Select"
              id="distribution"
            >
              {distribution.map((t, i) => (
                <option value={t} key={i}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`form-group-small ${
              processErrors.cycle_time && "error"
            }`}
          >
            <label htmlFor="cycle-time">Cycle Time</label>
            <input
              className="input input-small"
              type="number"
              id="cycle-time"
              {...registerProcess("cycle_time")}
            />

            {processErrors.cycle_time && (
              <p className="var(--red600)">
                {processErrors.cycle_time.message}
              </p>
            )}
          </div>
          <div
            className={`form-group-small ${processErrors.resource && "error"}`}
          >
            <label htmlFor="resource">Available Resource</label>
            <input
              className="input input-small"
              type="number"
              id="resource"
              {...registerProcess("resource")}
            />

            {processErrors.resource && (
              <p className="var(--red600)">{processErrors.resource.message}</p>
            )}
          </div>
          <button
            className="button button-primary"
            type="button"
            onClick={handleSubmitProcess((values) => {
              updateStep(values, id);
              onExpandedChange();
            })}
          >
            Update
          </button>
        </>
      )}
      {isExpanded && currentStep?.type === "Queue" && (
        <>
          <div className={`form-group-small ${queueErrors.name && "error"}`}>
            <label htmlFor="name">Name</label>
            <input
              className="input input-small"
              id="name"
              {...registerQueue("name")}
            />

            {queueErrors.name && (
              <p className="var(--red600)">{queueErrors.name.message}</p>
            )}
          </div>
          <div
            className={`form-group-small ${queueErrors.capacity && "error"}`}
          >
            <label htmlFor="capacity">Capacity</label>
            <input
              className="input input-small"
              type="number"
              id="capacity"
              {...registerQueue("capacity")}
            />

            {queueErrors.capacity && (
              <p className="var(--red600)">{queueErrors.capacity.message}</p>
            )}
          </div>
          <div
            className={`form-group-small ${queueErrors.resource && "error"}`}
          >
            <label htmlFor="resource">Resource</label>
            <input
              className="input input-small"
              type="number"
              id="resource"
              {...registerQueue("resource")}
            />

            {queueErrors.resource && (
              <p className="var(--red600)">{queueErrors.resource.message}</p>
            )}
          </div>
          <button
            className="button button-primary"
            type="button"
            onClick={handleSubmiQueue((values) => {
              updateStep(values, id);
              onExpandedChange();
            })}
          >
            Update
          </button>
        </>
      )}
    </div>
  );
}
