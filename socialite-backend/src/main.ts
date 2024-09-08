import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { JwtAuthGuard } from './modules/auth/jwt.guard';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, bodyParser: true });
  // app.use(passport.initialize());
  app.use(helmet());
  app.enableCors();
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new JwtAuthGuard());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3000, () => {
    PinoLogger.prototype.info('Server is running on Port:' + configService.get<number>('PORT'));
    PinoLogger.prototype.info('http://localhost:' + configService.get<number>('PORT'));
  });
}
bootstrap();
