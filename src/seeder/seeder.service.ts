import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Role } from 'src/role/role.entity';
import { Province } from 'src/province/province.entity';
import { City } from 'src/city/city.entity';
import { User } from 'src/user/user.entity';
import { Superadmin } from 'src/superadmin/superadmin.entity';

@Injectable()
export class SeederService {
  constructor(private readonly em: EntityManager) {}

  async seed() {
    dotenv.config();

    const em = this.em.fork();

    const roles = [{ name: 'SUPERADMIN' }];

    for (const roleData of roles) {
      const existingRole = await em.findOne(Role, { name: roleData.name });
      if (!existingRole) {
        const role = em.create(Role, roleData);
        await em.persistAndFlush(role);
      }
    }

    const existingProvince = await em.findOne(Province, { name: 'Jawa Barat' });
    let province;
    if (!existingProvince) {
      province = new Province('Jawa Barat', 1, 1);
      await em.persistAndFlush(province);
    } else {
      province = existingProvince;
    }

    const existingCity = await em.findOne(City, { name: 'Kota Bandung' });
    let city;
    if (!existingCity) {
      city = new City(province, 'Kota Bandung', 1, 1);
      await em.persistAndFlush(city);
    } else {
      city = existingCity;
    }

    const existingUser = await em.findOne(User, { username: 'superadmin' });

    if (!existingUser) {
      const password = await bcrypt.hash('Tes123@tes', 10);

      const user = em.create(User, {
        name: 'Super Admin',
        username: 'superadmin',
        email: 'superadmin@gmail.com',
        role: 1,
        password: password,
      });

      const superadmin = em.create(Superadmin, {
        user: user,
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        phone_number: '081234567890',
        birth_date: new Date('1995-01-01'),
        gender: 'Laki-laki',
        status: true,
        createdBy: 1,
        updatedBy: 1,
      });

      await em.persistAndFlush([user, superadmin]);
    }
  }
}
