import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginInput, LoginResponse } from './dto/login.input';
import { UserEntity } from '../user/entities/user.entity';
import { PinoLogger } from 'nestjs-pino';
import { AuthMessage } from './constants/auth.message';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly logger: PinoLogger,
    ) { }

    async validateUser(loginInput: LoginInput): Promise<UserEntity | null> {
        try {
            const user = await this.userService.findOneByIdentity(loginInput.identity);

            if (user && await bcrypt.compare(loginInput.password, user.password)) {
                return user;
            }
            throw new Error(AuthMessage.INVALID_CREDENTAILS);
        } catch (error) {
            this.logger.error(`Error validating user with identity: ${loginInput.identity}`, error);
            throw error;
        }
    }

    async login(user: UserEntity): Promise<LoginResponse> {
        try {
            const payload = { identity: user.identity, sub: user.id };
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,  // Short-lived access token
            });

            const refreshToken = this.jwtService.sign(payload, {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,  // Long-lived refresh token
            });

            return {
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (error) {
            this.logger.error('Error during login', error);
            throw new Error('Login failed');
        }
    }

    // Generate new access token using refresh token
    async refresh(token: string): Promise<LoginResponse> {
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.SECRET });
            const newPayload = { identity: payload.identity, sub: payload.sub };
            const accessToken = this.jwtService.sign(newPayload, {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,  // Short-lived access token
            });

            const refreshToken = this.jwtService.sign(newPayload, {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,  // Long-lived refresh token
            });

            return {
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (e) {
            throw e;
        }
    }
}
