// lib/mongodb.ts
import { MongoClient } from 'mongodb';

// Define a module-level variable to store the connection
let clientPromise: Promise<MongoClient>;

// Properly type the global variable with index signature
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = 'mongodb+srv://tngmongoadmin:i8VRwhkKJXt8kCz@01dev-cluster-o9fvj.mongodb.net/?retryWrites=true&w=majority&compressors=snappy,zlib,zstd';
const options = {};

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your MongoDB URI to .env.local');
// }

if (!uri) {
  // In development mode, use a global variable to preserve connection
  // across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each instantiation
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
