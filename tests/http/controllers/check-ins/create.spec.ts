import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { app } from "~/app";
import { createAndAuthenticateUser } from "tests/utils/create-and-authenticate-user";
import { prisma } from "~/lib/prisma";

describe("Create CheckIn Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should to be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: 0,
        longitude: 0,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: 0,
        longitude: 0,
      });

    expect(response.statusCode).toEqual(201);
  });
});
