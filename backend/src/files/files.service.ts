import { Injectable } from '@nestjs/common';
import * as FileType from 'file-type';
import mime from 'mime-types';
import { createReadStream, createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
@Injectable()
export class FilesService {
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
      const fileBuffer = await fs.readFile(filePath);
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
    let originalPath: string;
    let storagePath: string;
    const fileUUID = uuidv4();

    const savedFile = await th;
  }
}
