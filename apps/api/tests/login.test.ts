import { describe } from 'node:test';
import { AuthService } from '../src/auth/auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
describe('AuthService - registerUser & loginUser', () => {

    let service: AuthService;

    const prismaMock = {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
        },
    };

    beforeEach(() => {
        service = new AuthService(prismaMock as any);
        jest.clearAllMocks();
    });
    // 🟢 Успішний вхід
    it('should login user successfully', async () => {
        prismaMock.user.findFirst.mockResolvedValue({
            id: 1,
            email: 'test@test.com',
            password: '$2b$10$utcOsRLxPTP3731aGpBVtuykAL7ZjmZIJ0LyTmAXT5LuyTipa93MW',
            role: 'USER',
        });

        process.env.STATIC_SALT = '10';

        const result = await service.loginUser({
            email: 'test@test.com',
            password: 'Testpassword1',
        });

        expect(result).toBeDefined();
        expect(result.token).toBeDefined();
    });

    // 🔴 Недійсна електрона пошта
    it('should throw UnauthorizedException if email not found', async () => {
        prismaMock.user.findFirst.mockResolvedValue(null);

        await expect(
            service.loginUser({
                email: 'wrong@test.com',
                password: 'Test1234!',
            }),
        ).rejects.toThrow(UnauthorizedException);
    });

    // 🔴 Невірний пароль
    it('should throw UnauthorizedException if password is wrong', async () => {
        prismaMock.user.findFirst.mockResolvedValue({
            id: 1,
            email: 'testemail@test.com',
            password: 'Testpassword2',
            role: 'USER',
        });

        process.env.STATIC_SALT = 'pepper';

        await expect(
            service.loginUser({
                email: 'test@test.com',
                password: 'wrong',
            }),
        ).rejects.toThrow(UnauthorizedException);
    });

    // Нормалізація електроної пошти
    it('should convert email to lowercase before searching user', async () => {
  prismaMock.user.findFirst.mockResolvedValue({
    id: 1,
    email: 'test@test.com',
    password: 'hashed',
    role: 'USER',
  });

  process.env.STATIC_SALT = 'pepper';

  try {
    await service.loginUser({
      email: 'TEST@TEST.COM',
      password: 'wrong',
    });
  } catch (e) {}

  expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
    where: { email: 'test@test.com' },
  });
});
// структура відповіді
it('should return id, token and role on successful login', async () => {
  prismaMock.user.findFirst.mockResolvedValue({
    id: 1,
    email: 'test@test.com',
    password: '$2b$10$utcOsRLxPTP3731aGpBVtuykAL7ZjmZIJ0LyTmAXT5LuyTipa93MW',
    role: 'USER',
  });

  process.env.STATIC_SALT = '10';

  const result = await service.loginUser({
    email: 'test@test.com',
    password: 'Testpassword1',
  });

  expect(result).toHaveProperty('id');
  expect(result).toHaveProperty('token');
  expect(result).toHaveProperty('role');
});
});