import { UserEntity } from '../../modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserEntity, async (faker) => {
    const user = new UserEntity();

    user.full_name = faker.person.fullName();
    user.identity = faker.internet.email({
        firstName: user.full_name,
    });
    user.username = faker.internet.userName({
        firstName: user.full_name
    });
    user.password = 'Test@123';
    user.device_type = 1;

    return user;
});