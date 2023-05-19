import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "~/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "~/use-cases/fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -27,
      longitude: -49,
    });

    const { gyms } = await sut.handle({
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
