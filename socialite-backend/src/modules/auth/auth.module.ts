import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubSub } from 'graphql-subscriptions';
import { OpenAiService } from 'src/common/services/openai.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // Fetch the secret from .env
        signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver, PubSub, OpenAiService]
})
export class AuthModule { }
