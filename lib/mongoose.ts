import mongoose, { connect, Connection, mongo } from 'mongoose';

const MONGODB_URI = process.env.STORAGE_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('No MONGODB_URI specified.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  console.warn('trying tio connect');
  if (!cached) return;
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connect(MONGODB_URI as string).then(
      (m) => m
    ) as Promise<Connection>;
  }

  cached.conn = await cached.promise;
  console.warn('LOGGED INTO MONGODB.');
  return cached.conn;
}
