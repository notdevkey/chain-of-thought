import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { Process, getProcessData } from "../../models/process";
import { ProccessTree } from "../../parse";
import { useSteps } from "../../stores/steps.store";

interface Details {
  name: string;
  distribution: string;
  cycle_time: number;
  min_value: number;
  max_value: number;
  mean_value: number;
  std_dev: number;
  changeover: number;
  resource: number;
}
interface SimulationResults {
  timestamp: string;
  average_waiting_time: number;
  average_lead_time: number;
  average_throughput: number;
  plot_base64: string;
  results: Details[];
}

export default function RunTab() {
  const [resultsHistory, setResultsHistory] = useState<SimulationResults[]>([]);
  const { steps } = useSteps();
  // const { schema } = useFlowchartSchema();
  const { data: results, mutate: runSimulation } = useMutation(
    ["simulation", "run"],
    async () => {
      const firstNode = steps[0];
      let processes: Process = [];
      if (firstNode) {
        const parser = new ProccessTree();
        const exploer = await parser.traverseFlowchart(firstNode.id);

        const mapped = parser.countNodesAtEachLevel(exploer);
        processes = await getProcessData(mapped);
      }

      console.log(processes, "PROCESSES");

      const { data } = await axios.post<SimulationResults>(
        "http://localhost:5000/simulation/run",
        {
          environment: {
            simulation_time: 100,
            warm_up_time: 20,
            interarrival: 1,
          },
          processes,
        }
      );
      setResultsHistory((history) => [...history, data]);
      return data;
    }
  );

  console.log(results, "RESULTS");
  return (
    <>
      <button
        className="button button-primary"
        style={{ margin: "auto" }}
        type="button"
        onClick={() => runSimulation()}
      >
        Run
      </button>

      <div className="form-group">
        <label htmlFor="lead-time">Lead Time</label>
        <input
          className="input"
          type="number"
          id="lead-time"
          placeholder="Waiting compute"
          value={results?.average_lead_time}
        />
        <span className="status-text">Average lead time for a part</span>
      </div>
      <div className="form-group">
        <label htmlFor="throughput">Throughput</label>
        <input
          className="input"
          type="number"
          id="throughput"
          placeholder="Waiting compute"
          value={results?.average_throughput}
        />
        <span className="status-text">Average Throughput rate</span>
      </div>
      <div className="form-group">
        <label htmlFor="waiting">Waiting Time</label>
        <input
          className="input"
          type="number"
          id="waiting"
          placeholder="Waiting compute"
          value={results?.average_waiting_time}
        />
        <span className="status-text">Average Waiting time for a part</span>
      </div>
      <h3 className="h3">Runs</h3>
      {resultsHistory?.map((results) => (
        <div></div>
      ))}
    </>
  );
}
