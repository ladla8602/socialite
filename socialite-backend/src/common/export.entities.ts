import { PostCommentEntity } from "../modules/post/entities/post_comment.entity";
import { PostEntity } from "../modules/post/entities/post.entity";
import { UserEntity } from "../modules/user/entities/user.entity";
import { PostLikeEntity } from "../modules/post/entities/post_like.entity";
import { PostImageEntity } from "../modules/post/entities/post_image.entity";
import { PostVideoEntity } from "../modules/post/entities/post_video.entity";
import { PostTagEntity } from "../modules/post/entities/post_tag.entity";
import { TagEntity } from "../modules/post/entities/tag.entity";

export const ENTITIES = [
    UserEntity,
    PostEntity,
    PostCommentEntity,
    PostLikeEntity,
    PostImageEntity,
    PostVideoEntity,
    PostTagEntity,
    TagEntity,
]