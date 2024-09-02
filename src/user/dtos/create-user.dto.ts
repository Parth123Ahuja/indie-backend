import { isString, IsString } from "class-validator";

export class createUserDto{
    @IsString()
    email:string;

    @IsString()
    firebaseUid:string;
}