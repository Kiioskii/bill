import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TextService } from 'src/text/text.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [TextService],
})
export class FilesModule {}
