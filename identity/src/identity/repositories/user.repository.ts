import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { SignInDto, SignUpDto } from '../dto';
import { User } from '../entities';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async signUp(dto: SignUpDto): Promise<void> {
    const { login, password, firstName, lastName } = dto;
    const user = new User();
    user.login = login;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.firstName = firstName;
    user.lastName = lastName;
    try {
      await user.save();
    } catch (error) {
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Login is already taken');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn({ login, password }: SignInDto): Promise<User> {
    const user = await this.findOne({ login });
    if (user && user.password === (await this.hashPassword(password, user.salt))) {
      return user;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
