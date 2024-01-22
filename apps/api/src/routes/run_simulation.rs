use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::Local;
use image::{DynamicImage, ImageFormat};
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
    let url = "http://localhost:8000/models/api";

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

    // Decode the base64 string into a byte array
    let data = base64::decode(&simulation_results.plot_base64).unwrap();

    // Create an image from the byte array
    let image = image::load_from_memory(&data).unwrap();

    // Save the image to a file
    let file_path = format!("/assets/{}.png", current_time.format("%H-%M"));
    image.save_with_format(file_path, ImageFormat::Png).unwrap();

    db.write()
        .unwrap()
        .insert(Uuid::new_v4(), simulation_results.clone());

    Ok(Json(simulation_results))
    // Ok(())
}
