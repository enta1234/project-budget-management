import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesRepository } from './data/roles.repository';
import { Role, RoleSchema } from './data/role.schema';
import { RolesInitializer } from './roles.initializer';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, RolesInitializer],
  exports: [RolesService],
})
export class RolesModule {}
