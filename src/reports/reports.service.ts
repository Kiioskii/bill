import { Injectable, Logger } from '@nestjs/common';
import { Report } from './reports.entity';
import { supabase } from 'src/auth/supabase.client';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  async uploadFile(file: Express.Multer.File, userId: string) {
    const filename = `${Date.now()}_${file.originalname}`;

    console.log('filename', filename);

    const { error } = await supabase.storage
      .from('reports')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      this.logger.error('Supabase upload failed', error);
      throw new Error('File upload error');
    }

    const { data } = supabase.storage.from('reports').getPublicUrl(filename);
    const fileUrl = data.publicUrl;

    const { data: insertedReport, error: insertError } = await supabase
      .from('reports')
      .insert([
        {
          filename: file.originalname,
          path: fileUrl,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      this.logger.error('Supabase DB insert failed', insertError);
      throw new Error('Saving report to DB failed');
    }

    return insertedReport;
  }

  async getReportById(id: string) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.logger.error('Supabase fetch failed', error);
      throw new Error('Report not found');
    }

    return data;
  }
}
