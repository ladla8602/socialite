import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService, private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,  // Replace with your actual secret key or environment variable
        });
    }

    async validate(payload: any) {
        // Validate user based on the payload
        const user = await this.userService.findOneById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
