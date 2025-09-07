import { Injectable, Logger } from '@nestjs/common';
import { supabase } from '../config/supabase';
import { Document } from './documents.entity';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface reportData {
  data: object;
  from: string;
  to: string;
}

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  /**
   * Uploads a file to Supabase storage and inserts its metadata into the documents table.
   *
   * @param file - The file object received from Multer middleware.
   * @param userId - The ID of the user uploading the file.
   * @returns The inserted document metadata from the database.
   * @throws Error if the file upload or database insertion fails.
   */
  async uploadFile(file: Express.Multer.File, userId: string) {
    const uniqueId = uuidv4();

    const { error } = await supabase.storage
      .from('documents')
      .upload(`${userId}/${uniqueId}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      this.logger.error('Supabase upload failed', error);
      throw new Error('File upload error');
    }

    const { data: insertedDocument, error: insertError } = await supabase
      .from('documents')
      .insert([
        {
          filename: file.originalname,
          file_id: uniqueId,
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

  /**
   * Retrieves a signed URL for a document stored in Supabase Storage by its file ID and user ID.
   *
   * @param userId - The ID of the user who owns the document.
   * @param fileId - The ID of the document file to retrieve.
   * @returns A promise that resolves to the signed URL for accessing the document.
   * @throws Throws an error if the document cannot be found or if Supabase fetch fails.
   */
  async getDocumentById(userId: string, fileId: string) {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(`${userId}/${fileId}`, 300);

    if (error) {
      this.logger.error('Supabase fetch failed', error);
      throw new Error('Document do not found');
    }

    return data.signedUrl;
  }

  async extractDataFromDocument(
    userId: string,
    fileId: string,
    documentId: string,
  ) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(`${userId}/${fileId}`, 300);

      if (error) {
        this.logger.error('Supabase fetch failed', error);
        throw new Error('Document do not found');
      }

      const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL!;
      const fileUrl = data.signedUrl;

      const parms = { fileUrl: fileUrl, bank: 'ING' };

      const response = await axios.post(`${PDF_SERVICE_URL}/extract/`, parms, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const reportData = response.data;

      console.log('reportData', reportData);
      const x = {
        user_id: userId,
        document_id: documentId,
        from: reportData.from,
        to: reportData.to,
        data: reportData.data,
      };

      const responseDB = await supabase.from('report_data').insert([x]);

      // console.log('response', response.data);
    } catch (err) {
      console.log('err', err.message);
    }
  }

  /**
   * Retrieves a paginated list of documents from the 'documents' table.
   *
   * @param index - The page index (zero-based) to fetch.
   * @param limit - The number of documents to retrieve per page.
   * @returns A promise that resolves to an array of `Document` instances.
   * @throws Throws an error if the Supabase query fails.
   */
  async getDocumentList(index: number, limit: number): Promise<Document[]> {
    try {
      const from = index * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .range(from, to);

      if (error) throw error;

      const documents: Document[] = (data ?? []).map((d) => {
        const doc = new Document();
        doc.id = d.id;
        doc.userId = d.user_id;
        doc.filename = d.filename;
        doc.fileId = d.file_id;
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
