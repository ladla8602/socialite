import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UserRoutes } from './constants/user.routes';
import { PinoLogger } from 'nestjs-pino';
import { ApiResponse } from 'src/utils/types/response.type';
import { apiResponse } from 'src/utils/response-helper';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller(UserRoutes.USER)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UserController.name);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async users(@Req() req: any): Promise<ApiResponse<any>> {
        try {
            console.log(req.user.id)
            const users = await this.userService.findAll();
            return apiResponse(HttpStatus.OK, '', users);
        } catch (error) {
            this.logger.error({ error: error }, 'Error');
            throw error;
        }
    }
}
