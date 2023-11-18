const path = require('path');
const dotenvAbsolutePath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: dotenvAbsolutePath });
import { connect, connection, Types } from 'mongoose';

export class AppHelper {
    dbName: string | undefined;

    async start() {
        if (!this.dbName) {
            this.dbName = new Types.ObjectId().toString();
        }

        await connect(`${process.env.MONGO_URI}/${this.dbName}`);
    }

    async stop() {
        await connection.dropDatabase();
        await connection.close();
    }
}
