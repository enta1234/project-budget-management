import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './role.schema';

export interface CreateRoleInput {
  name: string;
}

@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  createRole(data: CreateRoleInput): Promise<Role> {
    const role = new this.roleModel({ ...data, levels: [] });
    return role.save();
  }

  addLevel(roleId: string, level: string): Promise<Role | null> {
    return this.roleModel
      .findByIdAndUpdate(roleId, { $addToSet: { levels: level } }, { new: true })
      .exec();
  }

  removeLevel(roleId: string, level: string): Promise<Role | null> {
    return this.roleModel
      .findByIdAndUpdate(roleId, { $pull: { levels: level } }, { new: true })
      .exec();
  }

  findAll(): Promise<Role[]> {
    return this.roleModel.find().sort({ name: 1 }).exec();
  }
}
