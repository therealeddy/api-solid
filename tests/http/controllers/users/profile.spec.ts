import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { app } from "~/app";
import { createAndAuthenticateUser } from "tests/utils/create-and-authenticate-user";

describe("Profile Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should to be able to profile", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "johndoe@example.com",
      })
    );
  });
});
