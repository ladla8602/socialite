import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm/data-source';

import InitSeeder from '../seeds/init.seeder';
import { ENTITIES } from '../../common/export.entities';

ConfigModule.forRoot({
    envFilePath: '.env',
});

const options = {
    type: process.env.DATABASE_TYPE,
    connectorPackage: 'mysql2',
    host: process.env.DATABASE_MASTER_HOST || 'localhost',
    port: Number(process.env.DATABASE_MASTER_PORT) || 3306,
    username: process.env.DATABASE_MASTER_USERNAME,
    password: process.env.DATABASE_MASTER_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ENTITIES,
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/../migrations/**/*.ts'],
    seeds: [InitSeeder],
};

export const source = new DataSource(
    options as DataSourceOptions & SeederOptions,
);