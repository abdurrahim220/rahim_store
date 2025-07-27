// db/connectDB.js
import mongoose from 'mongoose';
import config from '../config/config.js';
import superAdmin from './superAdmin.js';


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 5, 
      bufferCommands: false, 
    };

    cached.promise = mongoose.connect(config.connectionString, opts)
      .then(async mongoose => {
        console.log('MongoDB connected');
        try {
          await superAdmin();
          console.log('Super admin created');
        } catch (error) {
          console.error('Error creating super admin:', error);
        }
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;