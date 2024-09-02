import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { User } from '../user/user.entity';
import { CartItem } from './cart-Item.entity';
import { Transform } from 'class-transformer';

@Entity()
export class Cart {
  @PrimaryColumn()
  firebaseUid: string;

  @OneToOne(() => User, user => user.cart)
  @JoinColumn({ name: 'firebaseUid', referencedColumnName: 'firebaseUid' })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  items: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => value.toISOString())
  updatedAt: Date;
}


