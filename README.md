# WorkPlan-Teamway
Work planning REST application implemented Nodejs + express.js + mongodb.
## Requirements
    1. A worker has shifts
    2. A shift is 8 hours long
    3. A worker never has two shifts on the same day
    4. It is a 24 hour timetable 0-8, 8-16, 16-24
This repo is developed in gitpod environment (which I prefer).
## Run
    docker-compose up -d --build
## Test
    yarn test
## Swagger-UI endpoint : `/api-docs`
Do some test with this interface.
## Explanation
There are three data models in here : `workers, shifts, plans`

API structure can be found in openAPI swagger manifest.

Simple CRUD and a few more query apis are implemented.

When a worker or shift is deleted then their flag will set to false.

The plan will only return for the active workers. Inactive workers' shifts will be inactive.