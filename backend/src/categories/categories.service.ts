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
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            user_id: dto.userId,
            name: dto.name,
            icon: dto.icon,
            color: dto.color,
          },
        ])
        .select()
        .single();

      console.log('errr', error);

      return data;
    } catch (err: any) {
      this.logger.error('Supabase fetch failed', err);
      throw new Error('Create new category failed');
    }
  }

  async getCategoryList(userId: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);
      return data;
    } catch (err: any) {
      this.logger.error('Supabase fetch failed', err);
      throw new Error('Create new category failed');
    }
  }
}
