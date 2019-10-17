import * as path from 'path';
import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/**
 * Database manager class
 */
export class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`;

    let connection: Connection;
    if (this.connectionManager.has(CONNECTION_NAME)) {

      console.log('Using existing connection');
      connection = await this.connectionManager.get(CONNECTION_NAME);

      if (!connection.isConnected) {
        console.log('Spawning new connection');
        connection = await connection.connect();
      }
    } else {
      const connectionOptions: ConnectionOptions = {
        name: CONNECTION_NAME,
        type: 'mysql',
        port: +process.env.DB_PORT || 3306,
        synchronize: true,
        logging: !!process.env.DB_LOGGING,
        host: process.env.DB_HOST || 'localhost',
        username: process.env.DB_USERNAME || 'tester',
        database: process.env.DB_NAME || 'tester',
        password: process.env.DB_PASSWORD || 'vgKCnJgYSn6e26Yj',
        namingStrategy: new SnakeNamingStrategy(),
        connectTimeout: 3000,
        entities: [
          path.resolve(__dirname + '/../entities/*.js')
        ]
      };
      console.log('Creating a Connection');
      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
}
