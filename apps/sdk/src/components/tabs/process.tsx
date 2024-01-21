import { zodResolver } from "@hookform/resolvers/zod";
import { SelectionUpdateEvent } from "@mirohq/websdk-types";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSteps } from "../../stores/steps.store";
import StepDropdown from "../step-dropdown";

export const stepType = z.enum(["Process step", "Queue"]);
export const cycleTimeDistribution = z.enum(["Fixed", "Uniform"]);

export const processSchema = z.object({
  step_type: stepType,
  name: z.string().min(1),
  distribution: cycleTimeDistribution,
  cycle_time: z.coerce.number().min(1),
  resource: z.coerce.number().min(1),
});

export const queueSchema = z.object({
  name: z.string().min(1),
  capacity: z.coerce.number().min(1),
  resource: z.coerce.number().min(1),
});

export type ProcessSchema = z.TypeOf<typeof processSchema>;
export type QueueSchema = z.TypeOf<typeof queueSchema>;

export const stepTypes = Object.values(stepType.Values);
export const distribution = Object.values(cycleTimeDistribution.Values);

export default function ProcessTab() {
  const { addStep, steps, deleteStep } = useSteps();

  const [expandedStep, setExpandedStep] = useState<string | undefined>();
  const [isAddingStep, setIsAddingStep] = useState(false);

  const selectItem = useCallback((event: SelectionUpdateEvent) => {
    if (event.items.length > 1) return;

    setExpandedStep(event.items[0].id);
  }, []);

  const deleteItem = useCallback((event: any) => {
    if (event.items.length > 1) return;

    console.log(event);
    deleteStep(event.items[0].id);
  }, []);

  useEffect(() => {
    miro.board.ui.on("selection:update", selectItem);
    miro.board.ui.on("items:delete", deleteItem);

    return () => {
      miro.board.ui.off("selection:update", selectItem);
      miro.board.ui.off("items:delete", deleteItem);
    };
  }, []);

  const {
    register: registerProcess,
    handleSubmit: handleSubmitProcess,
    watch,
    reset,
    formState: { errors: processErrors },
  } = useForm<ProcessSchema>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      step_type: "Process step",
    },
  });

  const {
    register: registerQueue,
    handleSubmit: handleSubmitQueue,
    formState: { errors: queueErrors },
  } = useForm<QueueSchema>({
    resolver: zodResolver(queueSchema),
  });
  return (
    <>
      <h2 className="h2">Steps</h2>
      {!isAddingStep && (
        <button
          className="button button-primary"
          type="button"
          style={{ margin: "10px 0" }}
          onClick={() => setIsAddingStep(true)}
        >
          Add Step
        </button>
      )}
      {isAddingStep && watch("step_type") === "Process step" && (
        <>
          <div className="form-group">
            <select
              {...registerProcess("step_type")}
              className="select"
              id="step-type"
            >
              {stepTypes.map((t, i) => (
                <option value={t} key={i}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className={`form-group ${processErrors.name && "error"}`}>
            <label htmlFor="name">Name</label>
            <input className="input" id="name" {...registerProcess("name")} />

            {processErrors.name && (
              <p className="var(--red600)">{processErrors.name.message}</p>
            )}
          </div>
          <div className={`form-group ${processErrors.cycle_time && "error"}`}>
            <label htmlFor="distribution">Cycle Time Distribution</label>
            <select
              {...registerProcess("distribution")}
              className="select"
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
          <div className={`form-group ${processErrors.cycle_time && "error"}`}>
            <label htmlFor="cycle-time">Cycle Time</label>
            <input
              className="input"
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
          <div className={`form-group ${processErrors.resource && "error"}`}>
            <label htmlFor="resource">Available Resource</label>
            <input
              className="input"
              type="number"
              id="resource"
              {...registerProcess("resource")}
            />

            {processErrors.resource && (
              <p className="var(--red600)">{processErrors.resource.message}</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              className="button button-secondary"
              type="button"
              style={{ margin: "10px 0" }}
              onClick={() => {
                setIsAddingStep(false);
              }}
            >
              Cancel
            </button>
            <button
              className="button button-primary"
              type="button"
              style={{ margin: "10px 0", marginLeft: "10px" }}
              onClick={handleSubmitProcess((values) => {
                addStep(values, values.step_type!);
                reset();
                setIsAddingStep(false);
              })}
            >
              Confirm
            </button>
          </div>
        </>
      )}
      {isAddingStep && watch("step_type") === "Queue" && (
        <>
          <div className={`form-group ${queueErrors.name && "error"}`}>
            <label htmlFor="name">Name</label>
            <input className="input" id="name" {...registerQueue("name")} />

            {queueErrors.name && (
              <p className="var(--red600)">{queueErrors.name.message}</p>
            )}
          </div>
          <div className={`form-group ${queueErrors.capacity && "error"}`}>
            <label htmlFor="capacity">Capacity</label>
            <input
              className="input"
              id="capacity"
              type="number"
              {...registerQueue("capacity")}
            />

            {queueErrors.capacity && (
              <p className="var(--red600)">{queueErrors.capacity.message}</p>
            )}
          </div>
          <div className={`form-group ${queueErrors.resource && "error"}`}>
            <label htmlFor="resource">Resource</label>
            <input
              className="input"
              id="resource"
              type="number"
              {...registerQueue("resource")}
            />

            {queueErrors.resource && (
              <p className="var(--red600)">{queueErrors.resource.message}</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              className="button button-secondary"
              type="button"
              style={{ margin: "10px 0" }}
              onClick={() => {
                setIsAddingStep(false);
              }}
            >
              Cancel
            </button>
            <button
              className="button button-primary"
              type="button"
              style={{ margin: "10px 0", marginLeft: "10px" }}
              onClick={handleSubmitQueue((values) => {
                addStep(values, watch("step_type")!);
                reset();
                setIsAddingStep(false);
              })}
            >
              Confirm
            </button>
          </div>
        </>
      )}

      {/* <button
        className="button button-primary"
        type="button"
        onClick={buttonClick}
      >
        Next
      </button> */}
      <div className="grid">
        {steps.map((step) => (
          <StepDropdown
            id={step.id}
            key={step.id}
            isExpanded={expandedStep === step.id}
            name={step.name}
            onExpandedChange={() =>
              setExpandedStep((expandedStep) =>
                expandedStep === step.id ? undefined : step.id
              )
            }
          />
        ))}
      </div>
    </>
  );
}
