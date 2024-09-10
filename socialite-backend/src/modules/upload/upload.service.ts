import { Injectable } from "@nestjs/common";
import { ObjectCannedACL, PutObjectCommand, PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { UploadPath } from "./constants/upload.paths";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "../user/entities/user.entity";

@Injectable()
export class UploadService {
    private s3: S3;
    private publicVisibility: ObjectCannedACL = 'public-read';
    private privateVisibility: ObjectCannedACL = 'private';
    constructor(private configService: ConfigService) {
        this.s3 = new S3({
            endpoint: this.configService.get<string>('DIGITALOCEAN_SPACE_ENDPOINT'),
            region: this.configService.get<string>('DIGITALOCEAN_SPACE_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('DIGITALOCEAN_SPACE_KEY'),
                secretAccessKey: this.configService.get<string>('DIGITALOCEAN_SPACE_SECRET'),
            },
        });
    }

    private getFilePath(path: string, id: string, fileName: string): string {
        return path.replace(':id', id) + fileName;
    }

    async uploadUserProfile(file: Express.Multer.File, user: UserEntity): Promise<string> {
        const filePath = this.getFilePath(UploadPath.PROFILE_PATH, user.id, file.originalname);
        const params: PutObjectCommandInput = {
            Bucket: process.env.DIGITALOCEAN_SPACE_BUCKET,
            Key: filePath,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: this.publicVisibility,
        };
        try {
            const command = new PutObjectCommand(params);
            await this.s3.send(command);
            const url = `${this.configService.get<string>('DIGITALOCEAN_SPACE_URL')}/${params.Key}`;
            user.profile = params.Key;
            user.save();
            return url;
        } catch (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }
}