import {
	Db,
	MongoClient
} from "mongodb";
import { DatabaseConnectionError } from "@arunvaradharajalu/common.errors";
import {
	listenMongoDBConnectionEvents
} from "./listen-mongodb-connection-events";
import { MongoDBConnect, MongoDBConnectionStates } from "./utils";



class MongoDBConnectImpl implements MongoDBConnect {

	private _url: string | null = null;
	private _dbName: string | null = null;
	private _username: string | null = null;
	private _password: string | null = null;
	private _mongoClient: MongoClient | null = null;
	private _connectionState =
		MongoDBConnectionStates.disconnected;


	set url(url: string) {
		this._url = url;
	}

	set dbName(dbName: string) {
		this._dbName = dbName;
	}

	set username(userName: string) {
		this._username = userName;
	}

	set password(password: string) {
		this._password = password;
	}

	get connectionState(): MongoDBConnectionStates {
		return this._connectionState;
	}

	set connectionState(connectionState: MongoDBConnectionStates) {
		this._connectionState = connectionState;
	}

	get mongoClient(): MongoClient {
		if (!this._mongoClient)
			throw new DatabaseConnectionError("Mongo client not set");

		return this._mongoClient;
	}

	get dbContext(): Db {
		if (!this._mongoClient)
			throw new DatabaseConnectionError("Mongo client not set");

		if (!this._dbName)
			throw new DatabaseConnectionError("Db name not set");

		return this._mongoClient.db(this._dbName);
	}

	init(): void {
		if (!this._url)
			throw new DatabaseConnectionError("Url is not set in MongodbImpl");

		if (!this._username)
			throw new DatabaseConnectionError("Database username is not set in MongodbImpl");

		if (!this._password)
			throw new DatabaseConnectionError("Database password is not set in MongodbImpl");

		this._mongoClient = new MongoClient(this._url, {
			auth: { username: this._username, password: this._password },
			retryWrites: true
		});

		listenMongoDBConnectionEvents(this);
	}

	async connect(): Promise<void> {

		if (!this._mongoClient)
			throw new DatabaseConnectionError("Mongo client not set, should call init method before connects");

		try {
			await this._mongoClient.connect();
		} catch (error) {
			console.error("Error in db connect ::", error);

			throw new DatabaseConnectionError("Error, connecting to the database");
		}
	}

	isConnected(): boolean {
		return this.connectionState ===
			MongoDBConnectionStates.connected;
	}

	async reconnect(): Promise<void> {
		await this.connect();
	}
}

const mongoDBConnect = new MongoDBConnectImpl();

export {
	mongoDBConnect,
	MongoDBConnectImpl
};
