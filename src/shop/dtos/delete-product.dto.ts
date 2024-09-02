import { IsNumber } from "class-validator";

export class deleteProductDto{

    @IsNumber()
    id:number;
}