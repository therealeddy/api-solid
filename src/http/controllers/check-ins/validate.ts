import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeValidateCheckInUseCase } from "~/use-cases/factories/make-validate-check-in-use-case";

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(req.query);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.handle({
    checkInId,
  });

  return res.status(204).send();
}
