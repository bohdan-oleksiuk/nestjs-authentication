import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/authentication/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { RedisModule } from '../redis/redis.module';
import { Role } from '../role/entities/role.entity';
import { RolesGuard } from './authorization/guards/roles.guard';
import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { PolicyHandlerStorage } from './authorization/policies/policy-handlers.storage';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { GoogleAuthenticationController } from "./authentication/social/google-authentication.controller";
import { GoogleAuthenticationService } from "./authentication/social/google-authentication.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    RedisModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    PolicyHandlerStorage,
    FrameworkContributorPolicyHandler,
    AccessTokenGuard,
    AuthenticationService,
    GoogleAuthenticationService,
  ],
  controllers: [AuthenticationController, GoogleAuthenticationController],
})
export class IamModule {}
