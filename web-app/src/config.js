export const config = { 
  API_HOST: window.location.hostname,
  API_PORT: (process.env.NODE_ENV === "production") ? window.location.port : 8000,
  FORECAST_CITY: "Saint-Pee-sur-Nivelle"
}
