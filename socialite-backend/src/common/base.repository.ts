import { EntityCondition } from "src/utils/types/entity-condition.type";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";

export class BaseRepository<Entity> {
    repository: Repository<Entity>;
    constructor(repository: Repository<Entity>) {
        this.repository = repository;
    }

    async create(data: DeepPartial<Entity>): Promise<Entity> {
        const entity = this.repository.create(data);
        return await this.repository.save(entity);
    }

    async findOne(id: string): Promise<Entity | null> {
        return await this.repository.findOne({
            where: { id } as unknown as FindOptionsWhere<Entity>,
        });
    }

    async findAll(): Promise<Entity[]> {
        return await this.repository.find();
    }

    async update(id: string, data: DeepPartial<Entity>): Promise<Entity> {
        await this.repository.update(id, data as any);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async count(): Promise<number> {
        return await this.repository.count();
    }

    async findWithPagination(skip: number, take: number): Promise<[Entity[], number]> {
        return await this.repository.findAndCount({
            skip,
            take,
        });
    }
    async softDelete(id: number): Promise<void> {
        await this.repository.softDelete(id);
    }

    async restore(id: number): Promise<void> {
        await this.repository.restore(id);
    }

    async findOneByCondition(conditions: FindOptionsWhere<Entity>): Promise<Entity | null> {
        return await this.repository.findOne({ where: conditions });
    }

    async createMany(data: DeepPartial<Entity>[]): Promise<Entity[]> {
        const entities = this.repository.create(data);
        return await this.repository.save(entities);
    }

}