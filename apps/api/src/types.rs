use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Clone, Debug, Default, Deserialize)]
pub enum Distribution {
    #[default]
    Uniform,
    Exponential,
    Normal,
    Fixed,
}

#[derive(Serialize, Clone, Default, Debug, Deserialize)]
pub struct StepResult {
    pub item_number: i32,
    pub item_name: String,
    pub process_name: String,
    pub start_time: i32,
    pub waiting_time: i32,
    pub completion_time: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcessStep {
    #[serde(rename = "type")]
    step_type: String,
    name: String,
    distribution: String,
    cycle_time: u32,
    resource: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Queue {
    #[serde(rename = "type")]
    queue_type: String,
    name: String,
    capacity: u32,
    resource: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum Process {
    Step(ProcessStep),
    Steps(Vec<ProcessStep>),
    Queue(Queue),
    Queues(Vec<Queue>),
}
#[derive(Debug, Serialize, Clone, Deserialize)]
pub struct Environment {
    simulation_time: i32,
    warm_up_time: i32,
    interarrival: i32,
}

#[derive(Debug, Serialize, Clone, Deserialize)]
pub struct Simulation {
    pub environment: Environment,
    pub processes: Vec<Process>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Detail {
    item_name: String,
    process_name: String,
    start_time: i32,
    completion_time: i32,
    waiting_time: i32,
}

impl Default for Detail {
    fn default() -> Self {
        let mut rng = thread_rng();
        Self {
            item_name: format!("Item_{}", rng.gen_range(1..=100)),
            process_name: format!("Process_{}", rng.gen_range(1..=100)),
            start_time: rng.gen_range(1..=100),
            waiting_time: rng.gen_range(1..=100),
            completion_time: rng.gen_range(1..=100),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SimulationResults {
    pub average_waiting_time: i32,
    pub average_lead_time: i32,
    pub average_throughput: i32,
    pub timestamp: Option<String>,
    pub plot_base64: String,
    pub results: Vec<StepResult>,
}
