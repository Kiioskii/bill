import { Injectable } from '@nestjs/common';
import * as FileType from 'file-type';
import mime from 'mime-types';
import { createReadStream, createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { supabase } from 'src/config/supabase';
import { IDoc, TextService } from 'src/text/text.service';
@Injectable()
export class FilesService {
  constructor(private readonly textService: TextService) {}

  private readonly MIME_TYPES: any = {
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    googleDoc: 'application/vnd.google-apps.document',
    googleSheet: 'application/vnd.google-apps.spreadsheet',
  };

  private readonly mimeTypes = {
    text: {
      extensions: ['.txt', '.md', '.json', '.html', '.csv'],
      mimes: [
        'text/plain',
        'text/markdown',
        'application/json',
        'text/html',
        'text/csv',
      ],
    },
    audio: {
      extensions: ['.mp3', '.wav', '.ogg'],
      mimes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    },
    image: {
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
      mimes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
      ],
    },
    document: {
      extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
      mimes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
    },
  };

  /**
   * Determines the MIME type from a Buffer.
   * @param fileBuffer - The file content as a Buffer.
   * @param fileName - The name of the file.
   * @returns The MIME type as a string.
   */
  async getMimeTypeFromBuffer(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const fileTypeResult = await FileType.fileTypeFromBuffer(fileBuffer);

    if (fileTypeResult) {
      return fileTypeResult.mime;
    } else {
      const mimeType = mime.lookup(fileName);
      if (mimeType) {
        return mimeType;
      } else {
        return 'application/octet-stream';
      }
    }
  }

  async getFileFromStorage(filePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (error || !data) {
      throw new Error('Invalid file path: Can not find file in database');
    }
    return data;
  }

  // MIME Type Operations
  /**
   * Gets the MIME type of a file.
   * @param filePath - The path to the file.
   * @returns The MIME type as a string.
   */
  async getMimeType(filePath: string): Promise<string> {
    try {
      if (typeof filePath !== 'string') {
        throw new Error('Invalid file path: must be a string');
      }

      const data = await this.getFileFromStorage(filePath);

      const arrayBuffer = await data.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      return this.getMimeTypeFromBuffer(fileBuffer, filePath);
    } catch (error: any) {
      console.error(`Failed to get MIME type: ${error.message}`);
      throw error;
    }
  }

  /**
   * Determines the file category based on the MIME type.
   * @param mimeType - The MIME type of the file.
   * @returns The file category as "text", "audio", "image", or "document".
   */
  getFileCategoryFromMimeType(
    mimeType: string,
  ): 'text' | 'audio' | 'image' | 'document' {
    for (const [category, typeInfo] of Object.entries(this.mimeTypes)) {
      if (typeInfo.mimes.includes(mimeType)) {
        return category as 'text' | 'audio' | 'image' | 'document';
      }
    }
    // Default to "document" if no match is found
    return 'document';
  }

  /**
   * Checks if a file's MIME type matches the expected type.
   * @param filePath - The path to the file.
   * @param type - The expected type ("audio" | "text" | "image").
   */
  private async checkMimeType(
    filePath: string,
    type: 'audio' | 'text' | 'image',
  ): Promise<void> {
    const mimeType = await this.getMimeType(filePath);

    if (!this.mimeTypes[type].mimes.includes(mimeType)) {
      throw new Error(`Unsupported MIME type for ${type}: ${mimeType}`);
    }
  }

  async processFile(fileUrl: string, chunkSize?: number) {
    const storagePath: string = fileUrl;
    const fileUUID = uuidv4();

    const mimeType = await this.getMimeType(storagePath);
    const type = this.getFileCategoryFromMimeType(mimeType);
    let docs: IDoc[] = [];
    switch (type) {
      case 'text': {
        const databaseFile = await this.getFileFromStorage(storagePath);
        const textContent = await databaseFile.text();
        if (chunkSize) {
          const baseMetadata = {
            source: storagePath,
            path: storagePath,
            name: basename(storagePath),
            mimeType,
            source_uuid: fileUUID,
          };
          const chunks = await this.textService.split(
            textContent,
            chunkSize,
            baseMetadata,
          );
          docs = chunks.map((chunk) => ({
            ...chunk,
            metadata: {
              ...chunk.metadata,
              uuid: uuidv4(), // Generate a new UUID for each chunk
            },
          }));
        } else {
          docs = [
            await this.textService.document(textContent, undefined, {
              source: storagePath,
              path: storagePath,
              name: basename(storagePath),
              mimeType,
              source_uuid: fileUUID,
              uuid: uuidv4(),
            }),
          ];
        }
        break;
      }
      default:
        throw new Error(`Unsupported file type: ${type}`);
    }

    return { docs };
  }
}
