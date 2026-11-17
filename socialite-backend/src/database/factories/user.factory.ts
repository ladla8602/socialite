import { UserEntity } from '../../modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserEntity, async (faker) => {
    const user = new UserEntity();

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    user.full_name = `${firstName} ${lastName}`;
    user.identity = faker.internet.email({ firstName }).toLowerCase();
    
    // Ensure clean username <= 30 characters
    const cleanUsername = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(Math.random() * 9000 + 1000)}`;
    user.username = cleanUsername.substring(0, 30);
    
    user.password = 'Test@123';
    user.device_type = 1;

    return user;
});
