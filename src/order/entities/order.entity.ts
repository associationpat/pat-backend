import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatusEnum } from '../../Enums/order-status.enum';
import { TimestampEntity } from '../../shared/entities/timestamp.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('order')
export class Order extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastName: string;
  
  @Column()
  firstName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column({ type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
  status: OrderStatusEnum;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orders, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  product: Product;

  @Column()
  price: number;

  @BeforeInsert()
  async increaseReservedQuantity() {
    this.product.reservedQuantity += this.quantity;
  }

  updateStatus(newStatus: OrderStatusEnum) {
    if (this.status === newStatus) return;

    if (this.status === OrderStatusEnum.PENDING) {
      this.product.reservedQuantity -= this.quantity;
    }
    if (newStatus === OrderStatusEnum.PENDING) {
      this.product.reservedQuantity += this.quantity;
    }
    if (newStatus === OrderStatusEnum.CONFIRMED || newStatus === OrderStatusEnum.DELIVERED) {
      this.product.quantity -= this.quantity;
      this.product.soldQuantity += this.quantity;
    }
    if (this.status === OrderStatusEnum.CONFIRMED || this.status === OrderStatusEnum.DELIVERED) {
      this.product.quantity += this.quantity;
      this.product.soldQuantity -= this.quantity;
    }
    this.status = newStatus;
  }

  onDelete(productService) {
    if (this.status === OrderStatusEnum.PENDING) {
      productService.updateQuantity(this.product.id, { reservedQuantity: this.product.reservedQuantity - this.quantity });
    }
  }

  onRestore(productService) {
    if (this.status === OrderStatusEnum.PENDING) {
      productService.updateQuantity(this.product.id, { reservedQuantity: this.product.reservedQuantity + this.quantity });
    }
  }
}
