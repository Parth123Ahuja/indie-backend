import { IsArray, isArray, IsEmail, IsNumber, IsObject, IsString } from "class-validator";


export class OrderDto{

    @IsString()
    firebaseUid:string;

    @IsObject()
    OrderInfo:any;

    @IsArray()
    items:any;
}