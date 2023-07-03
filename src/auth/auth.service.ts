import { Users, Bookmarks } from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signup(dto: AuthDto) {
    // generate the password hash.
    const hash = await argon.hash(dto.password);
    // save the new user in the db.
    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      // return the saved user.
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('credentials incorrect');
    }

    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password is incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('credentials incorrect');
    }

    // send back the user.
    delete user.hash;
    return user;
  }
}
