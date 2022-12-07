import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './';

@Entity({ name: 'product_images' })
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    //Relación de mucho a uno con la entidad Product
    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' } //Eliminación en cascada. Se usa para eliminar lo objetos relacionados el producto que va a ser eliminado.
    )
    product: Product

}