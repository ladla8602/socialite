import { Processor, Process } from '@nestjs/bull';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SightengineService } from './sightengine.service';
import { Job } from 'bull';
import { PostService } from 'src/modules/post/post.service';

@Processor('sightengine')
@Injectable()
export class SightengineProcessor {
    constructor(
        @Inject(forwardRef(() => PostService))
        private readonly postService: PostService,
        private readonly sightengineService: SightengineService
    ) { }

    @Process()
    async handleImageAnalysis(job: Job) {
        const { imageUrl, postId } = job.data;
        try {
            const result = await this.sightengineService.analyzeImage(imageUrl);
            console.log('Sightengine analysis result:', result);
            //TODO:: Process the result as needed
            this.postService.savePostImage(postId, imageUrl, true);

        } catch (error) {
            console.error('Sightengine analysis failed:', error.message);
        }
    }
}
