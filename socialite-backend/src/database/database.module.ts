import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DATABASE_MASTER_HOST'),
                port: +configService.get<number>('DATABASE_MASTER_PORT'),
                username: configService.get<string>('DATABASE_MASTER_USERNAME'),
                password: configService.get<string>('DATABASE_MASTER_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                seeds: [__dirname + '/seeds/*.seed{.ts,.js}'],
                factories: [__dirname + '/factories/*.factory{.ts,.js}'],
                synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
                migrations: [__dirname + '/../**/*-migrations.{ts,js}'],
                replication: {
                    master: {
                        host: configService.get<string>('DATABASE_MASTER_HOST'),
                        port: +configService.get<number>('DATABASE_MASTER_PORT'),
                        username: configService.get<string>('DATABASE_MASTER_USERNAME'),
                        password: configService.get<string>('DATABASE_MASTER_PASSWORD'),
                        database: configService.get<string>('DATABASE_NAME'),
                    },
                    slaves: [
                        {
                            host: configService.get<string>('DATABASE_SLAVE_HOST'),
                            port: +configService.get<number>('DATABASE_SLAVE_PORT'),
                            username: configService.get<string>('DATABASE_SLAVE_USERNAME'),
                            password: configService.get<string>('DATABASE_SLAVE_PASSWORD'),
                            database: configService.get<string>('DATABASE_NAME'),
                        },
                        // Add more slaves as needed
                    ],
                },
                cli: {
                    entitiesDir: 'src',
                    migrationsDir: 'src/database/migrations',
                },
                logging: false,
                extra: {
                    trustServerCertificate: true,
                },
            }),
        }),
    ],
})
export class DatabaseModule { }

