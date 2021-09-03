import mongoose from 'mongoose'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod: MongoMemoryServer

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create()
      const mongoUri = mongod.getUri()
      return {
        uri: mongoUri,
        ...options,
      }
    },
  })

export const closeInMongodConnection = async () => {
  if (mongoose) await mongoose.disconnect()
  if (mongod) await mongod.stop()
}
