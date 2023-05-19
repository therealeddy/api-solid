import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreateGymUseCase } from "~/use-cases/factories/make-create-gym-use-case";

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createGynBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } =
    createGynBodySchema.parse(req.body);

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.handle({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  return res.status(201).send();
}
