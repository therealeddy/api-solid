import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { app } from "~/app";
import { createAndAuthenticateUser } from "tests/utils/create-and-authenticate-user";

describe("Nearby Gyms Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should to be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -27,
        longitude: -49,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript Gym",
        description: "Some description",
        phone: "11999999999",
        latitude: 0,
        longitude: 0,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -27,
        longitude: -49,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
