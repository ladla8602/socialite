import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725798748817 implements MigrationInterface {
    name = 'Migrations1725798748817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post_contents\` (\`id\` varchar(36) NOT NULL, \`post_id\` int NOT NULL, \`content_type\` tinyint NOT NULL COMMENT 'image = 0, video = 1', \`content\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`id\` varchar(36) NOT NULL, \`user_id\` int NOT NULL, \`desc\` text NULL, \`tags\` varchar(255) NULL, \`comments_count\` int NOT NULL DEFAULT '0', \`likes_count\` int NOT NULL DEFAULT '0', \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`contentId\` varchar(36) NULL, UNIQUE INDEX \`REL_149a3adbe4bfd24f4aebd07f5f\` (\`contentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`identity\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`username\` varchar(30) NOT NULL, \`full_name\` varchar(100) NULL, \`bio\` varchar(255) NULL, \`profile\` varchar(255) NULL, \`background_image\` varchar(255) NULL, \`is_push_notifications\` tinyint NOT NULL COMMENT '0 = not push notification, 1 = Push notification' DEFAULT '1', \`is_invited_to_room\` tinyint NOT NULL COMMENT '0 = Not invited to room publicly, 1 = Able to invite in room publicly' DEFAULT '1', \`is_verified\` tinyint NOT NULL COMMENT '0 = notVerified, 1 = verificationInPending, 2 = verified' DEFAULT '0', \`is_block\` tinyint NOT NULL COMMENT 'false = Unblock, true = Block' DEFAULT 0, \`is_active\` tinyint NOT NULL COMMENT 'false = Inavtive, true = Active' DEFAULT 1, \`block_user_ids\` json NULL, \`following\` int NULL, \`followers\` int NULL, \`login_type\` tinyint NULL COMMENT '0 = Google login, 1 = Apple Login, 2 = Email login, 3 = Phone login', \`device_type\` tinyint NOT NULL COMMENT '1 = Android, 2 = iOS', \`device_token\` varchar(255) NULL, \`latitude\` float NULL, \`longitude\` float NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b635d2aa252f3eb7c348ca2daf\` (\`identity\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_149a3adbe4bfd24f4aebd07f5fc\` FOREIGN KEY (\`contentId\`) REFERENCES \`post_contents\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_149a3adbe4bfd24f4aebd07f5fc\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_b635d2aa252f3eb7c348ca2daf\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_149a3adbe4bfd24f4aebd07f5f\` ON \`posts\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP TABLE \`post_contents\``);
    }

}
