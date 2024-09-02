// src/user/user.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUser(email:string){
    const result = await this.usersRepository.findOneBy({"email":email})
    if(!result){
      return null;
    }
    return result;
  }
  async findallUser(){
    return await this.usersRepository.find()
  }

  async createUser(email: string, firebaseUid: string): Promise<User> {
    const user = this.usersRepository.create({ email, firebaseUid });
    console.log("request coming"+ user)
    return await this.usersRepository.save(user);
  }

  async forSignup(email:string){
    const result = await this.usersRepository.findOneBy({"email":email})
    
    if(result){
      console.log("bad req");
      throw new ConflictException("User already exists");
    }
    return false;
  }

  // Other service methods (e.g., findOne, findAll) can go here
}
