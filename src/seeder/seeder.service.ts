import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Role } from 'src/role/role.entity';
import { Province } from 'src/province/province.entity';
import { City } from 'src/city/city.entity';

@Injectable()
export class SeederService {
  constructor(private readonly em: EntityManager) {}

  async seed() {
    dotenv.config();

    const em = this.em.fork();

    const roles = [
      {
        name: 'SUPERADMIN',
      },
      {
        name: 'ADMIN',
      },
      {
        name: 'KARYAWAN',
      },
    ];

    for (const roleData of roles) {
      const existingRole = await em.findOne(Role, { name: roleData.name });
      if (!existingRole) {
        const role = em.create(Role, roleData);
        await em.persistAndFlush(role);
      }
    }

    const province = new Province('Jawa Barat', 1, 1);
    await em.persistAndFlush(province);

    const city = new City(province, 'Ciamis', 1, 1);
    await em.persistAndFlush(city);

    const existingUser = await em.findOne(User, { username: 'superadmin' });
    if (!existingUser) {
      const password = await bcrypt.hash('Tes123@tes', 10);
      const userData = {
        name: 'superadmin',
        username: 'superadmin',
        email: 'superadmin@mail.com',
        role: 1,
        password: password,
      };

      const user = em.create(User, userData);
      await em.persistAndFlush(user);
    }
  }
}
