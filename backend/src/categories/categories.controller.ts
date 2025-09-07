import { SupabaseJwtGuard } from 'src/auth/supabase-jwt.guard';
import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(SupabaseJwtGuard)
  @Post('create')
  async createCategory(@Req() req, @Body dto: CreateCategoryDto) {
    const userId = req.user.id;
    const newCategory = await this.categoriesService.addCategory({
      userId,
      ...dto,
    });

    return {
      message: 'Kategoria została utworzona pomyślnie',
      category: newCategory,
    };
  }
}
