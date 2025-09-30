import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DocumentsController } from './documents/documents.controller';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
import { QuizzesController } from './quizzes/quizzes.controller';
import { QuizzesModule } from './quizzes/quizzes.module';
import { FilesModule } from './files/files.module';
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
    CategoriesModule,
    QuizzesModule,
    FilesModule,
  ],
  controllers: [AppController, DocumentsController, CategoriesController, QuizzesController],
  providers: [AppService, CategoriesService],
})
export class AppModule {}
