use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::Local;
use reqwest;
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

    // TODO: Add a request to the simulation API
    // let simulation_results = reqwest::get("http://localhost:3000/models/api")
    //     .await
    //     .map_err(|err| {
    //         eprintln!("Error: {}", err);
    //         StatusCode::INTERNAL_SERVER_ERROR
    //     })?
    //     .json::<SimulationResults>()
    //     .await
    //     .map_err(|err| {
    //         eprintln!("Error: {}", err);
    //         StatusCode::INTERNAL_SERVER_ERROR
    //     })?;

    let current_time = Local::now();
    let formatted_time = current_time.format("%d/%m %H:%M");

    let dummy_results = SimulationResults {
        image_url: "http://localhost:8000/assets/saul-goodman.gif".to_string(),
        timestamp: formatted_time.to_string(),
        details: vec![
            Detail::default(),
            Detail::default(),
            Detail::default(),
            Detail::default(),
            Detail::default(),
            Detail::default(),
        ],
    };

    db.write()
        .unwrap()
        .insert(Uuid::new_v4(), dummy_results.clone());

    Ok(Json(dummy_results))
}
