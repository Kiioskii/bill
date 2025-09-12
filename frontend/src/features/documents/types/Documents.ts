export type UUID = string;

export type Document = {
  id: UUID;
  category_id: UUID | null;
  title: string;
  description?: string;
  status?: string;
  priority?: number;
};

export type DocumentPage = {
  items: Document[];
  nextCursor: string | null; // cursor-based pagination
};

export type CreateDocumentPayload = {
  name: string;
  categoryId: string;
  file: File;
};
