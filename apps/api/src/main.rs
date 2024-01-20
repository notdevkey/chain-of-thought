use axum::{
    error_handling::HandleErrorLayer,
    http::StatusCode,
    routing::{get, patch, post},
    Router,
};
use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
    time::Duration,
};
use tower::{BoxError, ServiceBuilder};
use tower_http::{services::ServeDir, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use types::{Simulation, SimulationResults};
use uuid::Uuid;
mod routes;
mod types;

use routes::run_simulation::run_simulation;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_simulations=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let db = Db::default();

    let app = Router::new()
        .route("/simulation/run", post(run_simulation))
        .nest_service("/assets", ServeDir::new("assets"))
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|error: BoxError| async move {
                    if error.is::<tower::timeout::error::Elapsed>() {
                        Ok(StatusCode::REQUEST_TIMEOUT)
                    } else {
                        Err((
                            StatusCode::INTERNAL_SERVER_ERROR,
                            format!("Unhandled internal error: {error}"),
                        ))
                    }
                }))
                .timeout(Duration::from_secs(10))
                .layer(TraceLayer::new_for_http())
                .into_inner(),
        )
        .with_state(db);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap();

    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

type Db = Arc<RwLock<HashMap<Uuid, SimulationResults>>>;
