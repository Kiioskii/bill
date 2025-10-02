import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TextModule } from 'src/text/text.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [TextModule],
  exports: [FilesService],
})
export class FilesModule {}
