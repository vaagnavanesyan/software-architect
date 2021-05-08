import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() fileName: string;

  @Column({ nullable: true }) objectPath: string;
  @ManyToOne((_) => Order, (order) => order.images) order: Order;
}
