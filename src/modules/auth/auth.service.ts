import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,
        private jwtService: JwtService) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { email, name, password } = signUpDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({ email, name, password: hashedPassword });
        const token = this.jwtService.sign({ id: user._id });

        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException("Wrong user or password, please try again...");
        }
        
        const isPasswordOk = await bcrypt.compare(password, user.password);
        if (!isPasswordOk) {
            throw new UnauthorizedException("Wrong user or password, please try again...");
        }

        const token = this.jwtService.sign({ id: user._id });

        return { token };
    }
}
