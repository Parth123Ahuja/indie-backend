import { IsString } from 'class-validator';

export class getCartDto{
  @IsString()
  firebaseUid: string;
}
