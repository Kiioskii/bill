import { Injectable, Logger } from '@nestjs/common';
import { supabase } from '../config/supabase';
import { Document } from './documents.entity';
@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  async uploadFile(file: Express.Multer.File, userId: string) {
    const filename = `${Date.now()}_${file.originalname}`;

    const { error } = await supabase.storage
      .from('documents')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      this.logger.error('Supabase upload failed', error);
      throw new Error('File upload error');
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(filename);
    const fileUrl = data.publicUrl;

    const { data: insertedDocument, error: insertError } = await supabase
      .from('documents')
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

    return insertedDocument;
  }

  async getDocumentById(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.logger.error('Supabase fetch failed', error);
      throw new Error('Document do not found');
    }

    return data;
  }

  async getDocumentList(index: number, limit: number): Promise<Document[]> {
    try {
      const from = index * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .range(from, to);

      console.log('data', data);

      if (error) throw error;

      const documents: Document[] = (data ?? []).map((d) => {
        const doc = new Document();
        doc.id = d.id;
        doc.userId = d.user_id;
        doc.filename = d.filename;
        doc.path = d.path;
        doc.createdAt = new Date(d.created_at); // jeśli jest w stringu
        return doc;
      });

      return documents;
    } catch (err: any) {
      console.error('Error fetching documents:', err.message);
      throw err;
    }
  }
}
