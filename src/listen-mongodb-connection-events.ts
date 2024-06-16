import { MongoDBConnect, MongoDBConnectionStates } from "./utils/types";



export function listenMongoDBConnectionEvents(mongoDBConnect: MongoDBConnect) {
	mongoDBConnect.mongoClient.on("open", () => {
		mongoDBConnect.connectionState = MongoDBConnectionStates.connected;
	});

	mongoDBConnect.mongoClient.on("connectionReady", () => {
		mongoDBConnect.connectionState = MongoDBConnectionStates.connected;
	});

	mongoDBConnect.mongoClient.on("serverHeartbeatSucceeded", () => {
		mongoDBConnect.connectionState = MongoDBConnectionStates.connected;
	});

	mongoDBConnect.mongoClient.on("serverHeartbeatFailed", () => {
		mongoDBConnect.connectionState = MongoDBConnectionStates.disconnected;
	});

	mongoDBConnect.mongoClient.on("connectionClosed", () => {
		mongoDBConnect.connectionState = MongoDBConnectionStates.disconnected;
	});
}