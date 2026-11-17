import { UserEntity } from '../../modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const repository = dataSource.getRepository(UserEntity);

        // Predefined test users
        const defaultUsers = [
            {
                full_name: 'Mohd Gayasuddin',
                identity: 'ladla8602@gmail.com',
                username: 'ladla8602',
                password: 'Test@123',
                device_type: 1,
                bio: 'Software engineer and creator.',
            },
            {
                full_name: 'Alex Morgan',
                identity: 'alex@socialite.com',
                username: 'alex_morgan',
                password: 'Test@123',
                device_type: 1,
                bio: 'Welcome to my Socialite profile!',
            },
            {
                full_name: 'Sarah Connor',
                identity: 'sarah@socialite.com',
                username: 'sarah_c',
                password: 'Test@123',
                device_type: 1,
                bio: 'Photographer and designer.',
            },
        ];

        for (const userData of defaultUsers) {
            // Check if user already exists by username or identity
            const existingUser = await repository.findOne({
                where: [
                    { username: userData.username },
                    { identity: userData.identity },
                ],
            });

            if (!existingUser) {
                // repository.create + save ensures @BeforeInsert() hashes password with bcrypt
                const user = repository.create(userData);
                await repository.save(user);
                console.log(`[UserSeeder] Created user: ${userData.username} (${userData.identity})`);
            } else {
                console.log(`[UserSeeder] User already exists: ${userData.username}`);
            }
        }

        // Optional: Generate mock users via factory if available
        try {
            const userFactory = factoryManager.get(UserEntity);
            if (userFactory) {
                console.log('[UserSeeder] Generating mock users with factory...');
                await userFactory.saveMany(10);
                console.log('[UserSeeder] Successfully seeded 10 mock users.');
            }
        } catch (error) {
            console.warn('[UserSeeder] Note: Mock factory generation skipped or encountered warning:', error.message);
        }
    }
}