import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "~/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "~/use-cases/create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to register", async () => {
    const { gym } = await sut.handle({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
