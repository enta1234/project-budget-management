import { Injectable } from '@nestjs/common';
import {
  ResourcesRepository,
  CreateResourceInput,
  UpdateResourceInput,
} from './data/resources.repository';

@Injectable()
export class ResourcesService {
  constructor(private readonly repo: ResourcesRepository) {}

  getResources() {
    return this.repo.findAll().then(resources =>
      resources.map(r => ({
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        position: r.position,
        startDate: r.startDate,
      }))
    );
  }

  create(data: CreateResourceInput) {
    return this.repo.create(data);
  }

  update(id: string, data: UpdateResourceInput) {
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.remove(id);
  }
}
