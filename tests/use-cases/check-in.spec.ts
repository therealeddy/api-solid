import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { CheckInUseCase } from "~/use-cases/check-in";
import { InMemoryCheckInsRepository } from "~/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "~/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "~/use-cases/errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "~/use-cases/errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

const coordinateUser = {
  latitude: -25.3211232,
  longitude: -49.2826187,
};

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: coordinateUser.latitude,
      longitude: coordinateUser.longitude,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.handle({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: coordinateUser.latitude,
      userLongitude: coordinateUser.longitude,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not able to check in twice the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.handle({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: coordinateUser.latitude,
      userLongitude: coordinateUser.longitude,
    });

    await expect(() =>
      sut.handle({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: coordinateUser.latitude,
        userLongitude: coordinateUser.longitude,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should not able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.handle({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: coordinateUser.latitude,
      userLongitude: coordinateUser.longitude,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.handle({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: coordinateUser.latitude,
      userLongitude: coordinateUser.longitude,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-25.3143077),
      longitude: new Decimal(-49.3030257),
    });

    await expect(() =>
      sut.handle({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: coordinateUser.latitude,
        userLongitude: coordinateUser.longitude,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
