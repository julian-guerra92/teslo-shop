import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';


@Injectable()
export class SeedService {

  constructor(
    private readonly producstService: ProductsService
  ) { }

  async runSeed() {
    await this.insertNewProducts();
    return 'Seed executed!';
  }

  private async insertNewProducts() {
    await this.producstService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.producstService.create(product));
    })
    await Promise.all(insertPromises);
    return true;
  }

}
