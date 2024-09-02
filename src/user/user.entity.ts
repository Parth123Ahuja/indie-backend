import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Cart } from '../cart/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'user' })
  name: string;

  @Column({ unique: true, nullable: true })
  firebaseUid: string;

  @OneToOne(() => Cart, cart => cart.user, { cascade: true })
  cart: Cart;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
  updatedAt: Date;
}
