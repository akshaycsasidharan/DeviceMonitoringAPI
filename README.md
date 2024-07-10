# Device Monitoring API

## Project Title
  Device Monitoring API

## Project Description
  This project is a RESTful API server that allows authenticated users to monitor a device and get detailed uptime reports and analytical data reports. 
  It is built using Node.js, Express, MongoDB, and JWT tokens. The server provides three main APIs for accessing analytical data, uptime data, and an overall report, as well as an optional authentication API.

## Table of Contents
1. [Project Title](#project-title)
2. [Project Description](#project-description)
3. [Table of Contents](#table-of-contents)
4. [How to Install and Run the Project](#how-to-install-and-run-the-project)
5. [How to Use the Project](#how-to-use-the-project)
6. [API Documentation](#api-documentation)
7. [Swagger Documentation](#Swagger-documentation)


## How to Install and Run the Project
1. **Clone the repository:** 
  git clone https://github.com/yourusername/DeviceMonitoringAPI.git
  cd DeviceMonitoringAPI

   
## Install the dependencies:
  npm install

## Set up environment variables:
  Create a .env file in the root directory and add the following environment variables:
  MONGO_URI=your_mongodb_uri
  DB=your_database_name
  JWT_SECRET=your_jwt_secret

## Run the project:
  npm start

## How to Use the Project
  Generate Sample Data
  To generate and insert sample analytical and uptime data into your MongoDB collections, use the provided scripts:

## Generate and insert analytical data:
  node generateAnalyticalData.js

## Generate and insert uptime data:
  node generateUptimeData.js

## Authentication

  Generate a token by accessing the following endpoint:
  GET /api/auth/generate-token
  
  ## Analytical Data API
  GET /api/analytical
  Returns aggregated analytical data on a per-hour per-day basis.
  
  ## Uptime Data API
  GET /api/uptime
  Returns an array of objects containing the state of the device (connected or disconnected), the timestamp of the state change, and the duration of each state.
  
  ## Overall Report API
  GET /api/overallreport
  Returns the total and average analytical data, busiest and quietest days, and total uptime and downtime in a readable form.

### API Documentation
## Analytical Data API
  Endpoint: /api/analytical
  Method: GET
  Response:
  [
    {
      "dataByHour": [
        {
          "hour": 0,
          "count": 10
        },
        ...
      ],
      "net": 240,
      "avg": 10,
      "busiestHour": {
        "hour": 14,
        "count": 25
      }
    }
  ]

## Uptime Data API
  Endpoint: /api/uptime
  Method: GET
  Response:
  [
    {
      "state": "connected",
      "timestamp": "2024-05-01T00:00:00Z",
      "duration": 120
    },
    ...
  ]

## Overall Report API
  Endpoint: /api/overallreport
  Method: GET
  Response:
  {
    "totalAnalyticalData": 480,
    "averageAnalyticalData": 20,
    "busiestDay": "2024-05-10",
    "quietestDay": "2024-05-20",
    "totalUptime": "5 days",
    "totalDowntime": "2 days"
  }

## Swagger Documentation
  For detailed API documentation, visit the https://editor.swagger.io/

