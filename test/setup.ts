import { mongoDBConnect } from "../src";
import { testConfig } from "./utils/config/test.config";




beforeAll(async () => {
	mongoDBConnect.url = process.env.MONGO_URI as string;
	mongoDBConnect.username = testConfig.mongodbUsername;
	mongoDBConnect.password = testConfig.mongodbPassword;
	mongoDBConnect.dbName = testConfig.mongodbDatabaseName;

	try {
		mongoDBConnect.init();
		await mongoDBConnect.connect();
	} catch (error) {
		console.error("db connect :: error ::", error);
	}
});

beforeEach(async () => {
	const client = mongoDBConnect.mongoClient;
	const collections = await client
		.db(testConfig.mongodbDatabaseName)
		.collections();

	for (const collection of collections) {
		await collection.deleteMany({});
	}
});


afterAll(async () => {
	const client = mongoDBConnect.mongoClient;
	await client.close();
});
