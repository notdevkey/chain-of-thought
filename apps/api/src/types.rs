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
pub struct Process {
    pub name: String,
    pub distribution: Distribution,
    pub cycle_time: i32,
    pub min_value: i32,
    pub max_value: i32,
    pub mean_value: i32,
    pub std_dev: i32,
    pub changeover: i32,
    pub resource: i32,
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
    pub processes: Vec<ProcessType>,
}

#[derive(Serialize, Clone, Debug, Deserialize)]
#[serde(untagged)]
pub enum ProcessType {
    Single(Process),
    Multiple(Vec<Process>),
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
    pub timestamp: String,
    pub image_url: String,
    pub details: Vec<Detail>,
}
