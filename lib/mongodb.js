import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// For development, we'll use a mock connection since MongoDB might not be available
if (process.env.NODE_ENV === 'development') {
  // Create a mock client for development
  clientPromise = Promise.resolve({
    db: () => ({
      collection: () => ({
        findOne: async () => ({ username: 'test', password: 'test' }),
        insertOne: async () => ({ insertedId: 'mock-id' }),
        updateOne: async () => ({ modifiedCount: 1 }),
        deleteOne: async () => ({ deletedCount: 1 })
      })
    })
  });
} else {
  // In production mode, use real MongoDB connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

