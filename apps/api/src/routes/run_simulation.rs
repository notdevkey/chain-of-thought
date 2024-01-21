use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::Local;
use reqwest;
use serde_json::to_string;
use uuid::Uuid;

use crate::{
    types::{Detail, Simulation, SimulationResults},
    Db,
};

pub async fn run_simulation(
    State(db): State<Db>,
    Json(input): Json<Simulation>,
) -> Result<impl IntoResponse, StatusCode> {
    println!("{:?}", input);
    let client = reqwest::Client::new();
    let url = "https://3fb3-2a00-23c5-2683-eb01-fc93-bbdd-f016-5752.ngrok-free.app/models/api";

    let input_json = to_string(&input).map_err(|err| {
        eprintln!("Error serializing input to JSON: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let mut simulation_results = client
        .post(url)
        .body(input_json)
        .send()
        .await
        .map_err(|err| {
            eprintln!("Error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR
        })?
        .json::<SimulationResults>()
        .await
        .map_err(|err| {
            eprintln!("Error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    // println!("RESPONSE {:?}", simulation_results);

    let current_time = Local::now();
    let formatted_time = current_time.format("%d/%m %H:%M");

    simulation_results.timestamp = Some(formatted_time.to_string());

    db.write()
        .unwrap()
        .insert(Uuid::new_v4(), simulation_results.clone());

    Ok(Json(simulation_results))
    // Ok(())
}
