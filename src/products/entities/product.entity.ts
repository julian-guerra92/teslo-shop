import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '03b4d18d-0920-44f8-94fe-ee54a43518a7',
        description: 'Product ID',
        uniqueItems: true
    }) //Configuración para el enpoint de documetación del proyecto
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    }) //Configuración para el enpoint de documetación del proyecto
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price'
    }) //Configuración para el enpoint de documetación del proyecto
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Here is added the description of each product.',
        description: 'Product Description',
        default: null
    }) //Configuración para el enpoint de documetación del proyecto
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'mens_chill_crew_neck_sweatshirt',
        description: 'Product Slug - for SEO',
        uniqueItems: true
    }) //Configuración para el enpoint de documetación del proyecto
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 20,
        description: 'Product Stock',
        default: 0
    }) //Configuración para el enpoint de documetación del proyecto
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['Xs', 'S', 'M', 'L'],
        description: 'Product Sizes'
    }) //Configuración para el enpoint de documetación del proyecto
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'Women',
        description: 'Product Gender'
    }) //Configuración para el enpoint de documetación del proyecto
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    //Relación de uno a muchos con la entidad ProductImage
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true } //eager habilta las relaciones en el método find
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User

    //Validación y ajuste antes de insertar el objeto a la tabla
    @BeforeInsert()
    @BeforeUpdate()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }


}
