import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from './reports/reports.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    ReportsModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [AppController, ReportsController],
  providers: [AppService],
})
export class AppModule {}
