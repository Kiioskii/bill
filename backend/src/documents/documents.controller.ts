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
    const userId = req.user.sub;
    const document = await this.documentsService.uploadFile(file, userId);
    return document;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('getById')
  async getDocument(
    @Query('fileId') fileId: string,
    @Req() req: { user: { sub: string } },
  ): Promise<string | null> {
    const userId = req.user.sub;
    const url = await this.documentsService.getDocumentById(userId, fileId);
    if (!url) throw new Error('Document not found');

    return url;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('extractData')
  async extractData(
    @Query('fileId') fileId: string,
    @Query('documentId') documentId: string,
    @Req()
    req: { user: { sub: string } },
  ) {
    const userId = req.user.sub;

    await this.documentsService.extractDataFromDocument(
      userId,
      fileId,
      documentId,
    );
  }

  @Get('list')
  async listDocuments(
    @Query('index') index = '0',
    @Query('limit') limit = '10',
  ): Promise<Document[]> {
    const pageIndex = parseInt(index) || 0;
    const pageLimit = parseInt(limit) || 10;

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
