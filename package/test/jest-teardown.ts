import { MongoMemoryServer } from 'mongodb-memory-server';

module.exports = async function globalTeardown() {
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;

    await instance.stop();

    // await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DATABASE}`);
    // await mongoose.connection.db.dropDatabase();
    // await mongoose.disconnect();
};
