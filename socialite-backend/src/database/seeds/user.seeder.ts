import { UserEntity } from '../../modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const repository = dataSource.getRepository(UserEntity);
        const data = new UserEntity();

        data.full_name = 'Mohd Gayasuddin';
        data.identity = 'ladla8602@gmail.com';
        data.username = 'ladla8602';
        data.password = 'Test@123';
        data.device_type = 1;

        const user = await repository.findOneBy({ username: data.username });

        // Insert only one record with this username.
        if (!user) {
            await repository.insert([data]);
        }

        // ---------------------------------------------------

        const userFactory = factoryManager.get(UserEntity);

        // Insert only one record.
        await userFactory.save();

        // Insert many records in database.
        await userFactory.saveMany(40);
    }
}