import {
  Get,
  Req,
  Post,
  Param,
  Controller,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Report } from './reports.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadReport(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.id;
    console.log('userId', userId);
    const report = await this.reportsService.uploadFile(file, userId);
    return report;
  }

  @Get(':id')
  async getReport(@Param('id') id: string): Promise<Report | null> {
    const report = await this.reportsService.getReportById(id);
    if (!report) throw new Error('Report not found');

    return report;
  }
}
