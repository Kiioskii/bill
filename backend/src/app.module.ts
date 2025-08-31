import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DocumentsController } from './documents/documents.controller';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DocumentsModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [AppController, DocumentsController],
  providers: [AppService],
})
export class AppModule {}
