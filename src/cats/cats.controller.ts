import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  UsePipes,
} from '@nestjs/common';
import { CreateCatDTO } from './create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from 'src/interfaces/cat.interface';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { CreateCatDto, createCatSchema } from 'src/schema/createCatSchema';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @HttpCode(204)
  create(@Body() createCatDTO: CreateCatDTO): void {
    return this.catsService.create(createCatDTO);
  }

  @Post('/create')
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create2(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  findAll(): Cat[] {
    try {
      return this.catsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get('redirect')
  @Redirect('/cats', 301)
  redirect(@Query('version') version: string) {
    if (version === '5') {
      return { url: 'http://localhost:3000/' };
    }
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): string {
    console.log(id);
    return 'This action return one cat';
  }
}
