import { Db, MongoClient } from "mongodb";
import { DatabaseConnectionError } from "@arunvaradharajalu/common.errors";
import { MongoDBConnectImpl } from "../src/mongodb-connect";



describe("Mongodb Module", () => {
	const url = process.env.MONGO_URI as string;
	const userName = "testUsername";
	const password = "testPassword";
	const databaseName = "testDatabase";
	let _mongoDBConnect: MongoDBConnectImpl;

	beforeEach(() => {
		_mongoDBConnect = new MongoDBConnectImpl();
	});

	describe("\"init\" method", () => {
		describe("Exception Path", () => {
			it("Url string not set, should throw error", () => {
				expect(
					() => _mongoDBConnect.init()
				).toThrow(DatabaseConnectionError);
				expect(
					() => _mongoDBConnect.init()
				).toThrow("Url is not set in MongodbImpl");
			});

			it("UserName string not set, should throw error", () => {
				_mongoDBConnect.url = url;

				expect(
					() => _mongoDBConnect.init()
				).toThrow(DatabaseConnectionError);
				expect(
					() => _mongoDBConnect.init()
				).toThrow("Database username is not set in MongodbImpl");
			});

			it("Password string not set, should throw error", () => {
				_mongoDBConnect.url = url;
				_mongoDBConnect.username = userName;

				expect(
					() => _mongoDBConnect.init()
				).toThrow(DatabaseConnectionError);
				expect(
					() => _mongoDBConnect.init()
				).toThrow("Database password is not set in MongodbImpl");
			});
		});

		describe("Happy Path", () => {

			it("If all required values are set, should set the mongo client", () => {

				_mongoDBConnect.url = url;
				_mongoDBConnect.username = userName;
				_mongoDBConnect.password = password;

				_mongoDBConnect.init();

				expect(_mongoDBConnect.mongoClient).toBeInstanceOf(MongoClient);
			});
		});
	});

	describe("\"connect\"", () => {
		describe("Exception Path", () => {
			it("If url, username and password is invalid or failed to connect to db, should throw error", async () => {

				_mongoDBConnect.url = url;
				_mongoDBConnect.username = "invalidUsername";
				_mongoDBConnect.password = "invalidPassword";

				_mongoDBConnect.init();

				await expect(
					() => _mongoDBConnect.connect()
				).rejects.toThrow(DatabaseConnectionError);
				await expect(
					() => _mongoDBConnect.connect()
				).rejects.toThrow("Error, connecting to the database");
			});

			it("If db not initialized, should throw error", async () => {
				await expect(
					() => _mongoDBConnect.connect()
				).rejects.toThrow(DatabaseConnectionError);
				await expect(
					() => _mongoDBConnect.connect()
				).rejects.toThrow("Mongo client not set, should call init method before connects");
			});
		});

		describe("Happy Path", () => {

			it("If all required values are set, should connect to db and return true", async () => {
				const spyConnect = jest.spyOn(_mongoDBConnect, "connect");

				_mongoDBConnect.url = url;
				_mongoDBConnect.username = userName;
				_mongoDBConnect.password = password;

				_mongoDBConnect.init();

				await _mongoDBConnect.connect();

				expect(spyConnect).toHaveBeenCalled();
			});
		});
	});

	describe("\"mongoClient\" method", () => {

		describe("Exception Path", () => {

			it("MongoClient not set, should throw error", () => {
				expect(() => _mongoDBConnect.mongoClient)
					.toThrow(DatabaseConnectionError);
				expect(
					() => _mongoDBConnect.mongoClient
				).toThrow("Mongo client not set");
			});
		});

		describe("Happy Path", () => {

			it("If MongoClient is set, should return mongo Client", async () => {

				_mongoDBConnect.url = url;
				_mongoDBConnect.username = userName;
				_mongoDBConnect.password = password;

				_mongoDBConnect.init();
				await _mongoDBConnect.connect();
				expect(_mongoDBConnect.mongoClient).toBeInstanceOf(MongoClient);
			});
		});
	});

	describe("\"dbContext\" method", () => {

		describe("Exception Path", () => {

			it("MongoClient not set, should throw error", () => {
				expect(() => _mongoDBConnect.dbContext)
					.toThrow(DatabaseConnectionError);
				expect(
					() => _mongoDBConnect.dbContext
				).toThrow("Mongo client not set");
			});

			it("_dbName not set, should throw error", async () => {
				_mongoDBConnect.url = url;
				_mongoDBConnect.username = userName;
				_mongoDBConnect.password = password;

				_mongoDBConnect.init();
				await _mongoDBConnect.connect();

				expect(() => _mongoDBConnect.dbContext)
					.toThrow(DatabaseConnectionError);
				expect(
					() => _mongoDBConnect.dbContext
				).toThrow("Db name not set");
			});
		});

		describe("Happy Path", () => {
			it("If all required values are set, should return true", async () => {
				_mongoDBConnect.url = url;
				_mongoDBConnect.username = userName;
				_mongoDBConnect.password = password;

				_mongoDBConnect.init();
				await _mongoDBConnect.connect();

				_mongoDBConnect.dbName = databaseName;

				const dbContext = _mongoDBConnect.dbContext;
				expect(dbContext).toBeInstanceOf(Db);
			});
		});
	});

	describe("\"reconnect\" method", () => {
		describe("Happy Path", () => {
			it("If all required values are set, should able to reconnect", async () => {
				const spyConnect = jest.spyOn(_mongoDBConnect, "connect");

				_mongoDBConnect.url = url;
				_mongoDBConnect.username = userName;
				_mongoDBConnect.password = password;

				_mongoDBConnect.init();

				await _mongoDBConnect.reconnect();

				expect(spyConnect).toHaveBeenCalled();
			});
		});
	});
});

