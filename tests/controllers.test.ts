import { expect } from "chai";
import request from "supertest";
import { Express, Request } from "express";
import { createServer } from "../src/utils/createServer";
import mongoose from "mongoose";
import { resolve } from "path";

describe("controllers test", () => {
  var app: Express;
  before(async () => {
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
      return new Promise((resolve) => {
        request(app)
          .post("v1/worker")
          .send({
            firstName: "John",
            lastName: "Doe",
            email: "john@doe.com",
          })
          .set({ "Content-Type": "application/json" })
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            console.log("res = ", res)
            expect(res.body.firstName).to.equal("John");
            expect(res.body.lastName).to.equal("Doe");
            expect(res.body.email).to.equal("john@doe.com");
            resolve();
          });
      });
    });
    it("GET v1/worker", async () => {
      return new Promise((resolve) => {
        request(app)
          .get("v1/worker")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((req, res) => {
            console.log("res = ", res);
            resolve();
          });
      })
    });
  });

});