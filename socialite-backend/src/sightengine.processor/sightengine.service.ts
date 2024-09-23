import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SightengineService {
    private readonly sightengineUrl: string;
    private readonly sightengineApiKey: string;
    private readonly sightengineApiUser: string;

    constructor() {
        this.sightengineUrl = process.env.SIGHTENGINE_URL;
        this.sightengineApiUser = process.env.SIGHTENGINE_API_USER;
        this.sightengineApiKey = process.env.SIGHTENGINE_API_KEY;
    }

    async analyzeImage(imageUrl: string): Promise<any> {
        const url = `${this.sightengineUrl}/check.json`;
        try {
            const response = await axios.get(url, {
                params: {
                    'url': imageUrl,
                    'models': 'nudity-2.1',
                    'api_user': this.sightengineApiUser,
                    'api_secret': this.sightengineApiKey,
                }
            });

            return response.data;
        } catch (error) {
            throw new HttpException(`Failed to analyze image: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }
}
