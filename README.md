# Weather Forecast App (React + Vite + Tailwind)

This project shows weather by city using the free Open-Meteo API.

## Live Demo

After publishing this repository and enabling GitHub Pages, your demo URL will be:

https://YOUR_GITHUB_USERNAME.github.io/forecast/

## Screenshot

Add your screenshot in the repo and update this section to display it.

Example:

![Weather App Screenshot](./docs/screenshot.png)

## Features

- Search flow: enter city -> click Search -> display weather
- Current weather card (temperature, feels-like, wind, condition)
- Multi-day forecast card (next few days)
- Weather icons based on Open-Meteo weather codes
- Responsive UI built with Tailwind CSS

## Tech Stack

- React
- Vite
- Tailwind CSS
- Open-Meteo API (geocoding + forecast)
- react-icons (weather icons)

## Run Locally

```bash
npm install
npm run dev
```

## Run Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Deployment (GitHub Pages)

This project includes a GitHub Actions workflow to deploy on every push to main.

1. Push the repo to GitHub
2. In GitHub, open Settings -> Pages
3. Set Source to GitHub Actions
4. Push to main again (or rerun workflow)

## Open-Meteo Flow
The app uses two API calls when you search:

1. Geocoding API:
  - Converts city name -> latitude/longitude
  - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
2. Forecast API:
  - Uses latitude/longitude -> current + daily weather
  - Endpoint: `https://api.open-meteo.com/v1/forecast`

## Known Limitations

- Some city names are ambiguous (same name in multiple countries).
- Search currently picks the first geocoding result.
- No offline mode; internet is required.





