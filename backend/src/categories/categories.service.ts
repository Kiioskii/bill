import { Injectable, Logger } from '@nestjs/common';
import { supabase } from 'src/config/supabase';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  async addCategory(dto: {
    userId: string;
    name: string;
    icon: string;
    color: string;
  }) {
    try {
      const { data } = await supabase
        .from('categories')
        .insert([dto])
        .select()
        .single();

      return data;
    } catch (err: any) {
      this.logger.error('Supabase fetch failed', err);
      throw new Error('Create new category failed');
    }
  }
}
