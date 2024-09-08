import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeORMCLIModule } from './typeorm-cli.module';

@Injectable()
export class AppDataSource {
    private dataSource: DataSource;

    async getDataSourceOptions(): Promise<DataSourceOptions> {
        const appCtx = await NestFactory.createApplicationContext(TypeORMCLIModule);
        const configService = appCtx.get(ConfigService);

        return {
            type: process.env.DATABASE_TYPE as 'mysql' | 'postgres',
            host: configService.get<string>('DATABASE_MASTER_HOST'),
            port: +configService.get<number>('DATABASE_MASTER_PORT'),
            username: configService.get<string>('DATABASE_MASTER_USERNAME'),
            password: configService.get<string>('DATABASE_MASTER_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
            dropSchema: false,
            logging: process.env.NODE_ENV !== 'production',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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
            extra: {
                trustServerCertificate: true,
                max: configService.get<number>('DATABASE_MAX_CONNECTIONS', 100),
                ssl: configService.get<boolean>('DATABASE_SSL_ENABLED', false)
                    ? {
                        rejectUnauthorized: configService.get<boolean>('DATABASE_REJECT_UNAUTHORIZED', false),
                        ca: configService.get<string>('DATABASE_CA', undefined),
                        key: configService.get<string>('DATABASE_KEY', undefined),
                        cert: configService.get<string>('DATABASE_CERT', undefined),
                    }
                    : undefined,
            },
        };
    }

    async getDataSourceInstance(): Promise<DataSource> {
        if (!this.dataSource) {
            const dataSourceOptions = await this.getDataSourceOptions();
            this.dataSource = new DataSource(dataSourceOptions);
        }
        return this.dataSource;
    }
}

export const dataSourceInstance = (async () => {
    const appDataSource = new AppDataSource();
    return await appDataSource.getDataSourceInstance();
})();
