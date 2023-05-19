import { hash } from "bcryptjs";
import { UsersRepository } from "~/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user-alredy-exists";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 12);

    const userWithSameEdit = await this.usersRepository.findByEmail(email);

    if (userWithSameEdit) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
