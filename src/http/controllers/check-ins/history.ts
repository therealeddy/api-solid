import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchUserCheckInsHistoryUseCase } from "~/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export async function history(req: FastifyRequest, res: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(req.query);

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.handle({
    userId: req.user.sub,
    page,
  });

  return res.status(200).send({
    checkIns,
  });
}
