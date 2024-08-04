import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from '../Enums/user-role.enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}
  async create(createArticleDto: CreateArticleDto, currentUser: User) {
    if (
      currentUser.role == UserRoleEnum.SUPER_ADMIN ||
      currentUser.role == UserRoleEnum.ADMIN
    ) {
      const newArticle = this.articleRepository.create(createArticleDto);
      newArticle.user = currentUser;
      await this.articleRepository.save(newArticle);
      return newArticle;
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async findAll() {
    return await this.articleRepository.find(
      { relations: ['user']}
    );
  }

  async findOne(id: number) {
    return await this.articleRepository.findOne({where: { id }, relations: ['user']}
    );
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    currentUser: User,
  ) {
    if (
      currentUser.role == UserRoleEnum.SUPER_ADMIN ||
      currentUser.role == UserRoleEnum.ADMIN
    ) {
      const article = await this.articleRepository.findOneBy({ id });
      if (article) {
        await this.articleRepository.save({
          ...article,
          ...updateArticleDto,
        });
        return article;
      } else {
        throw new NotFoundException('Article not found');
      }
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async remove(id: number, currentUser: User) {
    if (
      currentUser.role == UserRoleEnum.SUPER_ADMIN ||
      currentUser.role == UserRoleEnum.ADMIN
    ) {
      return await this.articleRepository.softDelete(id);
    }
    throw new UnauthorizedException('Unauthorized');
  }
  async restore(id: number, currentUser: User) {
    if (
      currentUser.role == UserRoleEnum.SUPER_ADMIN ||
      currentUser.role == UserRoleEnum.ADMIN
    ) {
      return await this.articleRepository.restore(id);
    }
    throw new UnauthorizedException('Unauthorized');
  }
}
