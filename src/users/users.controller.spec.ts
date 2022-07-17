import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockedUserService: Partial<UsersService>;
  let mockedAuthService: Partial<AuthService>;
  const id = faker.random.numeric();
  const email = faker.internet.email();
  const password = faker.internet.password();

  beforeEach(async () => {
    mockedAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signUp: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    mockedUserService = {
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password } as User]);
      },
      findOne: (id: number) => {
        return Promise.resolve({ id, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockedUserService },
        { provide: AuthService, useValue: mockedAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('should return list of users with email', async () => {
    const users = await controller.findAllUsers(email);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(email);
  });

  test('should return list of users with email', async () => {
    const user = await controller.findUser(id);
    expect(user).toBeDefined();
  });

  test('should return logged in user and update session', async () => {
    const session = { userId: null };
    const user = await controller.signIn({ email, password }, session);
    expect(user).toBeDefined();
    expect(session.userId).toEqual(1);
  });

  test('should return new user and update session', async () => {
    const session = { userId: null };
    const user = await controller.createUser({ email, password }, session);
    expect(user).toBeDefined();
    expect(session.userId).toEqual(1);
  });
});
