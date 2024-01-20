use std::{default, vec};

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    types::{Process, ProcessType, Simulation},
    Db,
};

#[derive(Debug, Deserialize)]
pub struct CreateSimulation {
    pub processes: String,
}

// pub async fn simulation_get(State(db): State<Db>) -> impl IntoResponse {
//     let simulation = db.read().unwrap();

//     let simulation = simulation.values().cloned().collect::<Vec<_>>().clone();

//     Json(simulation)
// }

// pub async fn simulation_create(
//     State(db): State<Db>,
//     Json(input): Json<CreateSimulation>,
// ) -> impl IntoResponse {
//     let simulation = Simulation {
//         id: Uuid::new_v4(),
//         processes: vec![
//             ProcessType::Single(Process::default()),
//             ProcessType::Multiple(vec![Process::default(), Process::default()]),
//         ],
//     };

//     db.write()
//         .unwrap()
//         .insert(simulation.id, simulation.clone());

//     (StatusCode::CREATED, Json(simulation))
// }

// struct SimulationUpdate {}

// pub async fn simulation_update(
//     Path(id): Path<Uuid>,
//     State(db): State<Db>,
//     Json(input): Json<Simulation>,
// ) -> Result<impl IntoResponse, StatusCode> {
//     let mut simulation = db
//         .read()
//         .unwrap()
//         .get(&id)
//         .cloned()
//         .ok_or(StatusCode::NOT_FOUND)?;

//     db.write()
//         .unwrap()
//         .insert(simulation.id, simulation.clone());

//     Ok(Json(simulation))
// }
