import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { CreateCatDTO } from './create-cat.dto';
import { CatsService } from './cats.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  // curl http://localhost:3000/cats -H "Content-Type: application/json" -X POST -d '{"name":"Poko","age":1, "breed":"British Shorthair","ownerId":"657eb35d5405062704e4ad74"}'
  @Post()
  @HttpCode(204)
  async create(@Body() createCatDTO: CreateCatDTO) {
    try {
      return await prisma.cat.create({
        data: createCatDTO,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Something went wrong with creating a cat',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await prisma.cat.findMany({
        include: {
          owner: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Something went wrong with finding cats',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  // http://localhost:3000/cats/redirect
  // http://localhost:3000/cats/redirect?version=5
  @Get('redirect')
  @Redirect('/cats', 301)
  redirect(@Query('version') version: string) {
    if (version === '5') {
      return { url: 'http://localhost:3000/' };
    }
  }

  // http://localhost:3000/cats/6583d1aeb39c25d3000f3fbe
  @Get(':id')
  async findOne(
    @Param(
      'id',
      // new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    try {
      return await prisma.cat.findUnique({
        where: {
          id: id,
        },
        include: {
          owner: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Something went wrong with finding a cat with id: ' + id,
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
