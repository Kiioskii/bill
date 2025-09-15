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
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Document } from './documents.entity';
import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard';
import { CreateDocumentDto } from './dto/create-document-dto';
import { EditDocumentDto } from './dto/edit-document-dto';
import { User } from 'src/auth/auth.decorator';
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(SupabaseJwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadReport(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentDto,
    @User('sub') userId: string,
  ) {
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
    @User('sub') userId: string,
    @Query('fileId') fileId: string,
  ): Promise<string | null> {
    const url = await this.documentsService.getDocumentById(userId, fileId);
    if (!url) throw new Error('Document not found');

    return url;
  }

  @UseGuards(SupabaseJwtGuard)
  @Get('extractData')
  async extractData(
    @Query('fileId') fileId: string,
    @Query('documentId') documentId: string,
    @User('sub')
    userId: string,
  ) {
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

  @UseGuards(SupabaseJwtGuard)
  @Patch('edit')
  async editDocument(
    @User('sub') userId: string,
    @Body() dto: EditDocumentDto,
  ) {
    try {
      const editResponse = await this.documentsService.editDocument({
        userId,
        ...dto,
      });
      return editResponse;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
