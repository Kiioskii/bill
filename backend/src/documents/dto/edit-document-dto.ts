import { IsString, IsNotEmpty } from 'class-validator';

export class EditDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
