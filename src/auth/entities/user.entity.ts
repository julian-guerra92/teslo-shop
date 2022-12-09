import { Product } from '../../products/entities';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false //Se evita con esto que cuando se haga un find se devuelva la constraseña
    })
    password: string;

    @Column('text', {
        unique: true
    })
    fullName: string;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    //Relación de uno a muchos (Un usuario se relaciona con muchos products)
    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    @BeforeUpdate()
    checkFields(){
        this.email = this.email.toLowerCase().trim();
    }

}
