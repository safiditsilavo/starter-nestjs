import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail({}, { message: "Enter correct email please..." })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;
}