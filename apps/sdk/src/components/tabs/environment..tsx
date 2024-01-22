import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSimulationEnvironment } from "../../stores/environment.store";

const schema = z.object({
  simulation_time: z.coerce.number().min(1),
  warm_up_time: z.coerce.number().min(1),
  interarrival: z.coerce.number().min(1),
});

type Schema = z.TypeOf<typeof schema>;

interface Props {
  buttonClick(): void;
}

export default function EnvironmentTab({ buttonClick }: Props) {
  const { environment, updateEnvironment } = useSimulationEnvironment();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: environment,
  });

  return (
    <>
      <div className="form-group" style={{ marginTop: "20px" }}>
        <label htmlFor="simulation-time">Simulation Time</label>
        <input
          className="input"
          placeholder="Simulation"
          type="number"
          id="simulation-time"
          {...register("simulation_time")}
        />
        <span className="status-text">
          How long do you want to run simulation?
        </span>
        {errors.simulation_time && (
          <p className="var(--red600)">{errors.simulation_time.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="warm-up-time">Warm-up Time</label>
        <input
          className="input"
          placeholder="Seconds"
          type="number"
          id="warm-up-time"
          {...register("warm_up_time")}
        />
        <span className="status-text">How long before capturing results?</span>
        {errors.warm_up_time && (
          <p className="var(--red600)">{errors.warm_up_time.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="interarrival-time">Inter-arrival time</label>
        <input
          className="input"
          placeholder="Seconds"
          type="number"
          id="interarrival-time"
          {...register("interarrival")}
        />
        <span className="status-text">
          What is the rate of parts coming in systems?
        </span>
        {errors.interarrival && (
          <p className="var(--red600)">{errors.interarrival.message}</p>
        )}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={handleSubmit((values) => {
          updateEnvironment(values);
          buttonClick();
        })}
      >
        Save
      </button>
    </>
  );
}
