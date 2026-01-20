import { Button } from '@mantine/core';
import { Schema, model, connect } from 'mongoose';

// MongoDB
const mongodb_uri = process.env.MONGO_URI;

export default function Home() {
  return (
    <div>
      <Button>Vercel authenticated with Git</Button>
    </div>
  );
}
