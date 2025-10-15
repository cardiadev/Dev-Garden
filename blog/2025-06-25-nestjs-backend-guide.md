---
slug: nestjs-backend-guide
title: "Building Scalable APIs with NestJS: A Complete Guide"
authors: [cardiadev]
tags: [typescript, tutorial, best-practices]
---

NestJS has become my framework of choice for building backend APIs. Its TypeScript-first approach, dependency injection, and modular architecture make it perfect for scalable applications. Let me show you why.

<!-- truncate -->

## Why NestJS?

After years of working with Express and other Node.js frameworks, NestJS stands out:

- **🎯 TypeScript Native** - First-class TypeScript support
- **🏗️ Modular Architecture** - Organize code logically
- **💉 Dependency Injection** - Testable and maintainable
- **📚 Batteries Included** - Guards, pipes, interceptors built-in
- **🚀 Production Ready** - Used by enterprises worldwide

## Getting Started

Create a new NestJS project:

```bash
npm i -g @nestjs/cli
nest new my-api
cd my-api
npm run start:dev
```

Your API is now running at `http://localhost:3000`!

## Project Structure

```
src/
├── main.ts                 # Entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
└── users/
    ├── users.module.ts    # Feature module
    ├── users.controller.ts
    ├── users.service.ts
    ├── dto/
    │   └── create-user.dto.ts
    └── entities/
        └── user.entity.ts
```

## Basic CRUD Operations

### 1. Create a Module

```bash
nest g module users
nest g controller users
nest g service users
```

### 2. Define Entity

```typescript
// users/entities/user.entity.ts
export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
```

### 3. Create DTOs

```typescript
// users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

```typescript
// users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### 4. Service Layer

```typescript
// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      id: this.idCounter++,
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: number): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
```

### 5. Controller

```typescript
// users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

## Database Integration

### Using TypeORM

```bash
npm install @nestjs/typeorm typeorm pg
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      autoLoadEntities: true,
      synchronize: true, // Don't use in production!
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

```typescript
// users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

```typescript
// users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## Authentication with JWT

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
```

```typescript
// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
```

### JWT Guard

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Protect Routes

```typescript
// users/users.controller.ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // Protect all routes
export class UsersController {
  // ... routes
}
```

## Validation Pipes

Global validation:

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip unwanted properties
    forbidNonWhitelisted: true, // Throw error on extra properties
    transform: true, // Auto-transform payloads
  }));
  
  await app.listen(3000);
}
bootstrap();
```

## Exception Filters

```typescript
// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exceptionResponse['message'] || exception.message,
    });
  }
}
```

## Interceptors for Logging

```typescript
// interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(`${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
```

## Testing

```typescript
// users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [{ id: 1, name: 'Carlos', email: 'carlos@example.com' }];
    mockRepository.find.mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });
});
```

## Best Practices

1. **Module Organization** - One feature per module
2. **DTOs for Validation** - Always validate input
3. **Service Layer** - Keep business logic here
4. **Error Handling** - Use custom exceptions
5. **Environment Variables** - Use ConfigModule
6. **Testing** - Write tests for services and controllers
7. **Documentation** - Use Swagger/OpenAPI

## Production Checklist

- ✅ Environment variables configured
- ✅ Database migrations set up
- ✅ Error handling implemented
- ✅ Validation pipes enabled
- ✅ Authentication & authorization
- ✅ Rate limiting configured
- ✅ CORS configured properly
- ✅ Helmet for security headers
- ✅ Logging set up
- ✅ Tests written and passing

## Conclusion

NestJS brings structure and scalability to Node.js backends. Its TypeScript-first approach and Angular-inspired architecture make it a joy to work with.

Whether you're building a small API or a microservices architecture, NestJS has the tools you need.

Give it a try—you won't go back! 🐈

---

**Building APIs with NestJS? Let's connect on [LinkedIn](https://linkedin.com/in/cardiadev)!**
