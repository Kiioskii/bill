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
  Body,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Document } from './documents.entity';
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard';
import { CreateDocumentDto } from './dto/create-document-dto';
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(SupabaseJwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadReport(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentDto,
    @Req() req: { user: { sub: string } },
  ) {
    const userId = req.user.sub;
    return this.documentsService.uploadFile({
      name: body.name,
      categoryId: body.categoryId,
      file,
      userId,
    });
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

  @Get('listByCategory')
  async listDocuments(
    @Query('categoryId') categoryId = '',
    @Query('index') cursor = '0',
    @Query('limit') limit = '10',
  ): Promise<Document[]> {
    const pageCursor = parseInt(cursor) || 0;
    const pageLimit = parseInt(limit) || 10;

    const documentsList = await this.documentsService.getDocumentListByCategory(
      categoryId,
      pageCursor,
      pageLimit,
    );

    if (!documentsList || documentsList.length === 0) {
      throw new Error('Documents not found');
    }

    return documentsList;
  }
}
