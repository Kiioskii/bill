import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { error } from 'console';
import { describe, jest } from '@jest/globals';
import { supabase } from '../config/supabase';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'mocked-uuid') }));

const supabaseMock = {
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn(),
    createSignedUrl: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  insert: jest.fn(),
  select: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  range: jest.fn(),
};

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsService, Logger],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    jest.clearAllMocks();
  });

  describe('Upload file', () => {
    const fileMock: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: Buffer.from('fake file content'),
      size: 1234,
      destination: '',
      filename: '',
      path: '',
      stream: null,
    };

    const userId = 'user-123';

    it('should return doc after upload', async () => {
      supabaseMock.storage.upload.mockResolvedValue({ error: null });

      supabaseMock.insert.mockReturnThis();
      supabaseMock.select.mockReturnThis();
      supabaseMock.single.mockResolvedValue({
        data: {
          id: 1,
          filename: 'test.pdf',
          file_id: 'uuid123',
          user_id: 'user123',
          created_at: new Date(),
        },
        error: null,
      });

      // Act
      const result = await service.uploadFile(fileMock, userId);

      // Assert
      expect(result).toHaveProperty('filename', 'test.pdf');
      expect(result).toHaveProperty('file_id');
      expect(supabase.storage.uplad).toHaveBeenCalled();
      expect(supabase.insert).toHaveBeenCalled();
    });

    it('should throw error, when accrue issue', async () => {
      supabaseMock.storage.upload.mockResolvedValue({
        error: new Error('upload failed'),
      });

      await expect(service.uploadFile(fileMock, 'user123')).rejects.toThrow(
        'Saving report to DB failed' || 'File upload error',
      );

      expect(supabase.insert).not.toHaveBeenCalled();
    });
  });
});
