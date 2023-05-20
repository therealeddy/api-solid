import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCheckInUseCase } from "~/use-cases/factories/make-check-in-use-case";

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(req.body);
  const { gymId } = createCheckInsParamsSchema.parse(req.params);

  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.handle({
    gymId,
    userId: req.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return res.status(201).send();
}
