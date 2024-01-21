import { Frame, ShapeExperimental } from "@mirohq/websdk-types";
import { create } from "zustand";

interface Process {
  name: string;
  distribution: "Fixed" | "Uniform";
  cycle_time: number;
  resource: number;
}

interface Queue {
  name: string;
  capacity: number;
  resource: number;
}

interface StepsStore {
  steps: ((Process | Queue) & { id: string; type: "Process step" | "Queue" })[];
  addStep(step: Queue | Process, stepType: "Process step" | "Queue"): void;
  updateStep(step: Partial<Queue | Process>, id: string): void;
  deleteStep(id: string): void;
}

export const useSteps = create<StepsStore>()((set) => ({
  steps: [],
  updateStep: async (newStep: Partial<Queue | Process>, id: string) => {
    const [node] = (await miro.board.experimental.get({
      id,
    })) as ShapeExperimental[] | Frame[];

    if (node.type === "frame") {
      if (newStep.resource) {
        const children = (await node.getChildren()) as ShapeExperimental[];
        const difference = newStep.resource - children.length;

        if (difference > 0) {
          for (let i = 0; i < difference; i++) {
            const shape = await miro.board.experimental.createShape({
              shape: "flow_chart_process",
              type: "shape",
              style: {
                borderColor: "#0000ff",
                fillColor: "#0000ff",
                fillOpacity: 0.2,
              },
              height: 20,
              content: node.title,
            });

            await node.add(shape);
          }
        } else if (difference < 0) {
          for (let i = 0; i < Math.abs(difference); i++) {
            node.remove(children[i]);
          }
        }
        children.forEach(async (item) =>
          item.setMetadata(
            "simulation",
            JSON.stringify({
              ...JSON.parse(await item.getMetadata("simulation")),
              ...newStep,
              resource: 1,
            })
          )
        );
      }
    } else {
      await node.setMetadata(
        "simulation",
        JSON.stringify({
          ...JSON.parse(await node.getMetadata("simulation")),
          ...newStep,
        })
      );
      if (newStep.name) {
        node.content = newStep.name;
      }
    }
    await node.sync();

    set((state) => {
      // if (node?.shape !== ShapeName.FlowChartProcess) return {};
      const updatedSteps = state.steps.map((step) => {
        if (step.id === id) {
          return { ...step, ...newStep };
        }
        return step;
      });
      return { steps: updatedSteps };
    });
  },
  addStep: async (
    step: Queue | Process,
    stepType: "Process step" | "Queue"
  ) => {
    if (step.resource > 1) {
      const frame = await miro.board.createFrame({
        width: 400,
        height: 300,
        style: {
          fillColor: "#ffffff",
        },
        title: step.name,
      });
      for (let i = 0; i < step.resource; i++) {
        let shape: ShapeExperimental;
        if (stepType === "Process step") {
          shape = await miro.board.experimental.createShape({
            shape: "flow_chart_process",
            type: "shape",
            style: {
              borderColor: "#0000ff",
              fillColor: "#0000ff",
              fillOpacity: 0.2,
            },
            height: 20,
            content: `${step.name} ${i + 1}`,
          });
        } else {
          shape = await miro.board.experimental.createShape({
            shape: "flow_chart_merge",
            type: "shape",
            style: {
              borderColor: "#0000ff",
              fillColor: "#0000ff",
              fillOpacity: 0.2,
            },
            height: 20,
            content: `${step.name} ${i + 1}`,
          });
        }
        await frame.add(shape);
        await shape.setMetadata("simulation", JSON.stringify(step));
        set((state) => ({
          steps: [
            ...state.steps,
            {
              ...step,
              id: shape.id,
              name: `${step.name} ${i + 1}`,
              resource: 1,
              type: stepType,
            },
          ],
        }));
      }
    } else {
      let shape: ShapeExperimental;
      if (stepType === "Process step") {
        shape = await miro.board.experimental.createShape({
          shape: "flow_chart_process",
          type: "shape",
          style: {
            borderColor: "#0000ff",
            fillColor: "#0000ff",
            fillOpacity: 0.2,
          },
          height: 20,
          content: step.name,
        });
      } else {
        shape = await miro.board.experimental.createShape({
          shape: "flow_chart_merge",
          type: "shape",
          style: {
            borderColor: "#0000ff",
            fillColor: "#0000ff",
            fillOpacity: 0.2,
          },
          height: 20,
          content: step.name,
        });
      }
      await shape.setMetadata("simulation", JSON.stringify(step));
      set((state) => ({
        steps: [
          ...state.steps,
          { ...step, id: shape.id, name: step.name, type: stepType },
        ],
      }));
    }
  },
  deleteStep: (id: string) =>
    set((state) => ({ steps: state.steps.filter((step) => step.id !== id) })),
}));
