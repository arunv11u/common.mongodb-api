import { 
	Db, 
	MongoClient 
} from "mongodb";


enum MongoDBConnectionStates {
	connected = "CONNECTED",
	disconnected = "DISCONNECTED"
}

abstract class MongoDBConnect {

	abstract set url(url: string);

	abstract set dbName(dbName: string);

	abstract set username(username: string);

	abstract set password(password: string);

	abstract get connectionState(): MongoDBConnectionStates;

	abstract set connectionState(connectionState: MongoDBConnectionStates);

	abstract get mongoClient(): MongoClient;

	abstract get dbContext(): Db;

	abstract init(): void;

	abstract connect(): Promise<void>;

	abstract isConnected(): boolean;

	abstract reconnect(): Promise<void>;
}

export {
	MongoDBConnectionStates,
	MongoDBConnect
};