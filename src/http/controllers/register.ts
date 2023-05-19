import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "~/use-cases/errors/user-alredy-exists";
import { makeRegisterUseCase } from "~/use-cases/factories/make-register-use-case";

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.handle({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return res.status(409).send({ message: err.message });
    }

    throw err;
  }

  return res.status(201).send();
}
