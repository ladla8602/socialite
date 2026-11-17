import { ENTITIES } from "./src/common/export.entities";

export default {
    name: 'default',
    type: 'mysql',
    connectorPackage: 'mysql2',
    host: 'localhost', // or your MySQL server host
    port: 3306,        // MySQL default port
    username: 'root',  // your MySQL username
    password: '', // your MySQL password
    database: 'socialite', // your MySQL database name
    entities: ENTITIES,
    synchronize: true, // Use with caution in production; it auto-updates the schema
    logging: false,
    seeds: ["./src/database/seeds/*.seed{.ts,.js}"],
    factories: ["./src/database/*.factory{.ts,.js}"],
};