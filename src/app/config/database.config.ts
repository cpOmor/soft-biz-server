import mongoose, { ConnectOptions } from 'mongoose';
import config from '.';

export async function databaseConnecting() {
  try {
    if (config.mongo_prod == 'true' ) {
      await mongoose.connect(`${config.mongo_uri_prod}`, {
        serverSelectionTimeoutMS: 5000,
      } as ConnectOptions);

      console.log('Database      :🚀 Connected to database (Production)');
    } else {
      await mongoose.connect(config.mongo_uri_dev as string, {
        serverSelectionTimeoutMS: 5000,
      } as ConnectOptions);

      console.log('Database      :🚀 Connected to database (Development)');
    }
  } catch (error) {
    console.error('Database      :🙄 Error connecting to the database');
    console.error('Error details:', error);
    process.exit(1);
  }
}
