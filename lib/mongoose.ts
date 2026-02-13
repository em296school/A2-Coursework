import mongoose, { connect, Connection, mongo } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('No MONGODB_URI specified.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!cached) return;
  if (cached.conn) return cached.conn;
  console.log(MONGODB_URI);

  if (!cached.promise) {
    cached.promise = connect(MONGODB_URI as string).then(
      (m) => m
    ) as Promise<Connection>;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
