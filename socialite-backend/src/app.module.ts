import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { AppResolver } from './app.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { LoggingPlugin } from './common/plugins/logging.plugin';
import { PostModule } from './modules/post/post.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        level: isProduction ? 'error' : 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'yyyy-dd-mm, h:MM:ss TT',
            ignore: 'pid,hostname',
            customLevels: levels,
            useOnlyCustomLevels: true,
            singleLine: false,
            hideObject: true,
            messageFormat: '{context} - {msg}',
          },
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: false, envFilePath: '.env' }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'src/schema.gql'),
      debug: true,
      playground: true,
      sortSchema: true,
      context: ({ req }) => ({ req }),
      transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      plugins: [new LoggingPlugin()],
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'localhost',  // Redis host
    //   port: 6379,         // Redis port
    //   ttl: 600,           // Cache TTL in seconds
    //   isGlobal: true,     // Optional: Makes the cache module globally available
    // }),
    UserModule,
    PostModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
  ],
})
export class AppModule { }
