import { Controller } from "@nestjs/common";
import { UploadRoute } from "./constants/upload.routes";
import { Post, UseInterceptors, UploadedFile, Req, HttpCode, UseGuards } from "@nestjs/common/decorators";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { PinoLogger } from "nestjs-pino";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { apiResponse } from "src/utils/response-helper";
import { UploadMessage } from "./constants/upload.messages";
import { UserEntity } from "../user/entities/user.entity";
import * as multer from 'multer';
import { Request } from 'express';

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_PROFILE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

@Controller(UploadRoute.UPLOAD)
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly logger: PinoLogger,
    ) {
    }

    @Post(UploadRoute.PROFILE)
    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
            if (ALLOWED_PROFILE_IMAGE_MIME_TYPES.includes(file.mimetype)) {
                callback(null, true);
            } else {
                (req as any).fileValidationError = 'Invalid file type. Only JPEG, PNG, and GIF are allowed.';
                callback(null, false);
            }
        },
        limits: {
            fileSize: MAX_PROFILE_IMAGE_SIZE,
        },
    }))
    async uploadUserProfile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        if (req.fileValidationError) {
            throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);
        }

        if (!file) {
            throw new HttpException('No image provided', HttpStatus.BAD_REQUEST);
        }

        const user: UserEntity = req.user;
        try {
            const imageUrl = await this.uploadService.uploadUserProfile(file, user);
            return apiResponse(HttpStatus.OK, UploadMessage.PROFILE_UPLOAD_SUCCESS, { url: imageUrl });
        } catch (error) {
            throw new HttpException(`Failed to upload image: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}