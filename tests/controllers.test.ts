import { expect } from "chai";
import request from "supertest";
import { Express, Request } from "express";
import { createServer } from "../src/utils/createServer";
import mongoose from "mongoose";

import { getRandomInt } from "../src/utils/random";

const mockWorkers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
  },
  {
    firstName: "Adam",
    lastName: "Smith",
    email: "adam@smith.com",
  },
  {
    firstName: "Joe",
    lastName: "Biden",
    email: "joe@biden.com",
  },
  {
    firstName: "Jeff",
    lastName: "Bezos",
    email: "jeff@bezos.com",
  },
  {
    firstName: "Elon",
    lastName: "Musk",
    email: "elon@musk.com",
  },
  {
    firstName: "Cristiano",
    lastName: "Ronaldo",
    email: "cristiano@ronaldo.com",
  }
];

const mockShift = [
  {
    startHour: 0,
    endHour: 8,
  },
  {
    startHour: 8,
    endHour: 16,
  },
  {
    startHour: 16,
    endHour: 24,
  },
];

const mockDates = [
  "2022-11-22",
  "2022-11-23",
  "2022-11-24",
  "2022-11-25",
  "2022-11-26",
  "2022-11-27",
  "2022-11-28",
]

var workerData: any, shiftData: any, planData: any;

describe("controllers test", () => {
  var app: Express;
  before(async () => {
    console.log("before")
    app = await createServer();
    return new Promise<void>((resolve) => {
      app.listen(process.env.PORT || 5000, () => {
        console.log("Test server is running on 5000");
        resolve();
      });
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe("Worker", () => {
    it("POST v1/worker", async () => {
      return new Promise(async (resolve) => {
        for (let i = 0; i < mockWorkers.length; i++) {
          const worker = mockWorkers[i];
          await new Promise<void>((resolve) => {
            request(app)
              .post("/v1/worker")
              .send(worker)
              .set({ "Content-Type": "application/json" })
              .expect("Content-Type", /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.firstName).to.be.equal(worker.firstName);
                expect(res.body.lastName).to.be.equal(worker.lastName);
                expect(res.body.email).to.be.equal(worker.email);
                resolve();
              });
          });
        }
        resolve();
      });
    });
    it("POST /v1/worker email taken 409", async () => {
      return new Promise((resolve) => {
        request(app)
          .post("/v1/worker")
          .send(mockWorkers[0])
          .set({ "Content-Type": "application/json" })
          .expect("Content-Type", /json/)
          .expect(409)
          .end((err, res) => {
            expect(res.body.message).to.be.equal("Worker email already taken.");
            resolve();
          });
      })
    })
    it("GET v1/worker", async () => {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/worker")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body.length).to.be.equal(6);
            console.log("workerData", res.body);
            workerData = res.body;
            resolve();
          });
      });
    });
  });
  describe("Shift", () => {
    it("POST v1/shift", async () => {
      return new Promise(async (resolve) => {
        for (let i = 0; i < mockShift.length; i++) {
          let shift = mockShift[i];
          await new Promise<void>((resolve) => {
            request(app)
              .post("/v1/shift")
              .send(shift)
              .set({ "Content-Type": "application/json" })
              .expect("Content-Type", /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.startHour).to.be.equal(shift.startHour);
                expect(res.body.endHour).to.be.equal(shift.endHour);
                resolve();
              });
          });
        }
        resolve();
      });
    });
    it("POST /v1/shift same shift 409", async () => {
      return new Promise((resolve) => {
        request(app)
          .post("/v1/shift")
          .send(mockShift[0])
          .set({ "Content-Type": "application/json" })
          .expect("Content-Type", /json/)
          .expect(409)
          .end((err, res) => {
            expect(res.body.message).to.be.equal("Same shift already exists.");
            resolve();
          });
      });
    });
    it("GET /v1/shift", async () => {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/shift")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body.length).to.be.equal(3);
            console.log("shiftData = ", res.body);
            shiftData = res.body;
            resolve();
          });
      });
    });
  });
  describe("Plan", () => {
    it("POST /v1/plan", async () => {
      return new Promise(async (resolve) => {
        for (let i = 0; i < mockDates.length; i++) {
          let date = mockDates[i];
          console.log(i);
          for (let j = 1; j <= shiftData.length; j++) {
            console.log(j);
            let shift = shiftData[j - 1];
            let worker = workerData[getRandomInt(workerData.length)];
            await new Promise<void>((resolve) => {
              request(app)
                .post("/v1/plan")
                .send({
                  date,
                  workerId: worker.id,
                  shiftId: shift.id,
                })
                .set({ "Content-Type": "application/json" })
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                  console.log("res.status = ", res.status);
                  if (res.status !== 200) j--;
                  resolve();
                });
            });
          }
        }
        resolve();
      });
    });
    it("GET /v1/plan",async () => {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/plan")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body.length).to.be.equal(21);
            console.log("planData = ", res.body);
            planData = res.body;
            resolve();
          });
      });
    });
  });
});