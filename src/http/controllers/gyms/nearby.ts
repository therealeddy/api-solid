import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchNearbyGymsUseCase } from "~/use-cases/factories/meke-fetch-nearby-gyms-use-case";

export async function nearby(req: FastifyRequest, res: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.body);

  const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymUseCase.handle({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return res.status(201).send({
    gyms,
  });
}
