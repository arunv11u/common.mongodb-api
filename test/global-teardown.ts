/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoMemoryReplSet } from "mongodb-memory-server";

export = async function globalTeardown() {
	try {
		const replSet: MongoMemoryReplSet = (global as any).__MONGOINSTANCE;
		await replSet.stop();
	} catch (error) {
		console.error("Error in global teardown :", error);
	}
};
