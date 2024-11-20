import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { PinoLogger } from 'nestjs-pino';
import { AuthMessage } from './constants/auth.message';
import { OAuth2Client } from 'google-auth-library';
import { LoginInput } from './dto/request-auth.dto';
import { LoginResponse } from './dto/response-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly logger: PinoLogger,
        private readonly client: OAuth2Client,
    ) {
        client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async validateUser(loginInput: LoginInput): Promise<UserEntity | null> {
        try {
            const user = await this.userService.findOneByIdentity(loginInput.identity);
            if (user && !user.is_active) {
                throw new Error(AuthMessage.ACCOUNT_BLOCKED);
            }
            if (user && await bcrypt.compare(loginInput.password, user.password)) {
                if (loginInput.device_token) {
                    await this.userService.updateDeviceToken(user.id, loginInput.device_token);
                }
                return user;
            }

            throw new Error(AuthMessage.INVALID_CREDENTAILS);
        } catch (error) {
            this.logger.error(`Error validating user with identity: ${loginInput.identity}`, error);
            throw error;
        }
    }

    async generateToken(user: UserEntity): Promise<any> {
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
            user: user,
        };
    }

    async login(user: UserEntity): Promise<LoginResponse> {
        try {
            const result = await this.generateToken(user);
            return result;
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

    async validateUserForGoogleLogin(googleId: string, email: string, deviceToken?: string): Promise<LoginResponse> {
        let user = await this.userService.findByGoogleId(googleId);

        if (!user) {
            user = await this.userService.findOneByEmail(email);
            if (!user) {
                return null;
            }
        }

        user.device_token = deviceToken;
        await user.save();

        const result = await this.generateToken(user);
        return result;
    }

    async verifyGoogleToken(token: string, deviceToken?: string) {
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const googleId = payload.sub;
        const email = payload.email;
        return this.validateUserForGoogleLogin(googleId, email, deviceToken);
    }
}
