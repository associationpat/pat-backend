import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';
import { Order } from 'src/order/entities/order.entity';
import { IsNotEmpty, Max, Min } from 'class-validator';

@Entity('product')
export class Product extends TimestampEntity {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  price: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  @Max(1)
  @Min(0)
  @IsNotEmpty()
  discount: number;

  @Column()
  photo: string;

  @OneToMany(() => Order, (order) => order.product, {
    cascade: ['insert', 'update'],
  })
  orders: Order[];

  @Column({type: 'int', default: 0})
  quantity: number;

  @Column({ type: 'int', default: 0 })
  reservedQuantity: number;

  @Column({ type: 'int', default: 0 })
  soldQuantity: number

  getAvailableQuantity(){
    return this.quantity - this.reservedQuantity;
  }
}
