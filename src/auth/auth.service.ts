import { Users, Bookmarks } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  async signup(dto: AuthDto) {
    // generate the password hash.
    const hash = await argon.hash(dto.password);
    // save the new user in the db.

    // return the saved user.
    return { msg: 'I have signed up' };
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
