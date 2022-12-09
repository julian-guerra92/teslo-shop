import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';
import { User } from 'src/auth/entities/user.entity';

import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {

  constructor(
    private readonly producstService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUSers();
    await this.insertNewProducts(adminUser);
    return 'Seed executed!';
  }

  private async deleteTables() {
    await this.producstService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async insertUSers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(({ password, ...userData }) => {
      users.push(this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      }))
    })
    await this.userRepository.save(users);
    return users[0];
  }

  private async insertNewProducts(user: User) {
    await this.producstService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.producstService.create(product, user));
    })
    await Promise.all(insertPromises);
    return true;
  }

}
