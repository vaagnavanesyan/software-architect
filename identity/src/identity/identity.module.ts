import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthController,
  HealthController,
  UserController,
} from './controllers';
import { UserRepository } from './repositories';
import { AuthService } from './services';
import { metrics } from './services/metrics.provider';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topsecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [...metrics, AuthService],
  controllers: [HealthController, UserController, AuthController],
})
export class IdentityModule {}
