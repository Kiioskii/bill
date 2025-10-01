import { Injectable } from '@nestjs/common';
import * as FileType from 'file-type';
import mime from 'mime-types';
import { exec } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';
import TurndownService from 'turndown';
import { basename, join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { supabase } from 'src/config/supabase';
import { IDoc, TextService } from 'src/text/text.service';

const execAsync = promisify(exec);
const pump = promisify(pipeline);
@Injectable()
export class FilesService {
  constructor(private readonly textService: TextService) {}
  private turndownService = new TurndownService();

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
   * Converts CSV content to Markdown.
   * @param csvContent - The CSV content as a string.
   * @returns The Markdown representation of the CSV.
   */
  private csvToMarkdown(csvContent: string): string {
    const [headerLine, ...lines] = csvContent.split('\n');
    const headers = headerLine.split(',');
    const markdownLines = [
      `| ${headers.join(' | ')} |`,
      `| ${headers.map(() => '---').join(' | ')} |`,
      ...lines.map((line) => `| ${line.split(',').join(' | ')} |`),
    ];
    return markdownLines.join('\n');
  }

  /**
   * Converts HTML content to Markdown.
   * @param filePath - The path to the HTML file.
   * @returns The Markdown content as a string.
   */
  private async convertHTMLToMarkdown(filePath: string): Promise<string> {
    try {
      const dataFile = await this.getFileFromStorage(filePath);
      const buffer = Buffer.from(await dataFile.arrayBuffer());
      const html = buffer.toString('utf-8');
      return this.turndownService.turndown(html);
    } catch (error: any) {
      console.error(`Failed to convert HTML to Markdown: ${error.message}`);
      throw error;
    }
  }

  // Conversion Utilities
  /**
   * Processes an Office file and returns its Markdown content and PDF path.
   * @param filePath - The path to the Office file.
   * @returns An object containing the Markdown content and PDF path.
   */
  async processOfficeFile(filePath: string): Promise<{ markdown: string }> {
    const ext = extname(filePath).slice(1);
    const mimeType = this.MIME_TYPES[ext];
    if (!mimeType) throw new Error(`Unsupported file type: ${ext}`);

    const tempFiles: string[] = [];

    try {
      let markdown: string;
      if (ext.includes('xl')) {
        const dataFile = await this.getFileFromStorage(filePath);
        const buffer = Buffer.from(await dataFile.arrayBuffer());
        const csvContent = buffer.toString('utf-8');

        markdown = this.csvToMarkdown(csvContent);
      } else {
        markdown = await this.convertHTMLToMarkdown(filePath);
      }

      return { markdown };
    } catch (error: any) {
      console.error(`Failed to process Office file: ${error.message}`);
      throw error;
    } finally {
      // Clean up temporary files, but not the PDF
      for (const tempFile of tempFiles) {
        await fs.unlink(tempFile).catch(() => {});
      }
    }
  }

  // External Tools Checks
  /**
   * Checks if an external command-line tool is available.
   * @param toolName - The name of the tool (e.g., "pdftohtml").
   */
  private async checkExternalTool(toolName: string): Promise<void> {
    try {
      await execAsync(`which ${toolName}`);
    } catch {
      throw new Error(`${toolName} is not installed or not in PATH`);
    }
  }

  private async safeFileFromStorage(
    fileName: string,
    fileUrl: string,
    userId: string,
  ): Promise<string> {
    const file = await this.getFileFromStorage(fileUrl);
    const tempPath = `../temp/${userId}/${fileName}`;

    const stream = file.stream(); // Blob.stream()
    const fileStream = createWriteStream(tempPath);

    await pump(stream, fileStream);

    return tempPath;
  }

  // PDF Operations
  /**
   * Reads a PDF file and converts it to Markdown.
   * @param filePath - The path to the PDF file.
   * @returns The Markdown content as a string.
   */
  private async readPdfFile(
    fileName: string,
    filePath: string,
    userId: string,
  ): Promise<string> {
    await this.checkExternalTool('pdftohtml');

    const tempFiles: string = await this.safeFileFromStorage(
      fileName,
      filePath,
      userId,
    );
    const tempHtmlPath = `${tempFiles}.html`;

    try {
      await execAsync(
        `pdftohtml -s -i -noframes "${tempFiles}" "${tempHtmlPath}"`,
      );

      let htmlContent = await fs.readFile(tempHtmlPath, 'utf-8');
      htmlContent = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
      htmlContent = htmlContent.replace(/<title>.*?<\/title>/i, '');
      const markdownContent = this.turndownService.turndown(htmlContent);

      return markdownContent;
    } catch (error: any) {
      console.error(`Failed to read PDF file: ${error.message}`);
      throw error;
    } finally {
      // Clean up temporary files
      for (const tempFile of tempFiles) {
        await fs.unlink(tempFile).catch(() => {});
      }
    }
  }

  async readDocumentFile(filePath: string): Promise<IDoc> {
    try {
      const mimeType = await this.getMimeType(filePath);
      if (!this.mimeTypes.document.mimes.includes(mimeType)) {
        throw new Error(`Unsupported document file MIME type: ${mimeType}`);
      }

      let content: string;

      if (
        [
          this.MIME_TYPES.doc,
          this.MIME_TYPES.docx,
          this.MIME_TYPES.xls,
          this.MIME_TYPES.xlsx,
        ].includes(mimeType)
      ) {
        console.log('Processing office file...', mimeType);
        const { markdown } = await this.processOfficeFile(filePath);
        content = markdown;
      } else if (mimeType === this.MIME_TYPES.pdf) {
        content = await this.readPdfFile(filePath);
      } else {
        throw new Error(`Unsupported document file MIME type: ${mimeType}`);
      }

      const additionalMetadata = {
        source: filePath,
        path: filePath,
        name: basename(filePath),
        mimeType: mimeType,
      };

      const doc = await this.textService.document(
        content.trim(),
        undefined,
        additionalMetadata,
      );

      return doc;
    } catch (error: any) {
      console.error(`Failed to read document file: ${error.message}`);
      throw error;
    }
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
      case 'document': {
        const docContent = await this.readDocumentFile(fileUrl);
        if (chunkSize) {
          docs = await this.textService.split(docContent.text, chunkSize);
        } else {
          docs = [docContent];
        }
        break;
      }
      default:
        throw new Error(`Unsupported file type: ${type}`);
    }

    return { docs };
  }
}
