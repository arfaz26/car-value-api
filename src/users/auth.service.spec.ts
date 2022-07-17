import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: Partial<UsersService>;
  const email = faker.internet.email();
  const password = faker.internet.password();
  const users: User[] = [];

  beforeEach(async () => {
    mockedUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockedUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should return user with salted and hashed password', async () => {
    const user = await service.signUp(email, password);
    expect(user.password).not.toEqual(password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  test('should throw an error for user already exists', async () => {
    mockedUserService.find = () =>
      Promise.resolve([{ id: 1, email, password } as User]);
    await expect(service.signUp(email, password)).rejects.toThrow(
      BadRequestException,
    );
  });

  test('should throw user not found error', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    await expect(service.signIn(email, password)).rejects.toThrow(
      NotFoundException,
    );
  });

  test('should throw password not match error', async () => {
    mockedUserService.find = () =>
      Promise.resolve([{ id: 1, email, password } as User]);
    await expect(service.signIn(email, password)).rejects.toThrow(
      BadRequestException,
    );
  });

  test('should return user for valid email and password', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    await service.signUp(email, password);
    const user = await service.signIn(email, password);
    expect(user).toBeDefined();
  });
});
