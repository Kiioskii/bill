import {
  Get,
  Req,
  Post,
  Param,
  Controller,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Document } from './documents.entity';
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard';
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(SupabaseJwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadReport(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { sub: string } },
  ) {
    console.log('req', req.user);
    const userId = req.user.sub;
    const document = await this.documentsService.uploadFile(file, userId);
    return document;
  }

  // @Get(':id')
  // async getDocument(@Param('id') id: string): Promise<Document | null> {
  //   const document: Document = await this.documentsService.getDocumentById(id);
  //   if (!document) throw new Error('Document not found');

  //   return document;
  // }

  @Get('list')
  async listDocuments(
    @Query('index') index = '0',
    @Query('limit') limit = '10',
  ): Promise<Document[]> {
    const pageIndex = parseInt(index) || 0;
    const pageLimit = parseInt(limit) || 10;

    console.log('index', pageIndex);
    console.log('pageLimit', pageLimit);

    const documentsList = await this.documentsService.getDocumentList(
      pageIndex,
      pageLimit,
    );

    if (!documentsList || documentsList.length === 0) {
      throw new Error('Documents not found');
    }

    return documentsList;
  }
}
