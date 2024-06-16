import { ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";
import { 
	MongoDBConnectionStates, 
	MongoDBRepository, 
	MongoDBRepositoryImpl, 
	mongoDBConnect 
} from "../../src";
import { GenericError } from "../../src/utils/errors";


describe("Repository Module", () => {
	const collectionName = "testCollection";
	const dataArr = [
		{
			_id: new ObjectId(),
			name: faker.internet.userName(),
			Age: faker.datatype.number(),
			DOB: faker.date.past()
		},
		{
			_id: new ObjectId(),
			name: faker.internet.userName(),
			Age: faker.datatype.number(),
			DOB: faker.date.past()
		},
		{
			_id: new ObjectId(),
			name: faker.internet.userName(),
			Age: faker.datatype.number(),
			DOB: faker.date.past()
		}
	];
	const filter = { _id: dataArr[1]._id };
	const removeFilter = {
		name: { $in: [dataArr[0].name, dataArr[1].name] }
	};
	const options = { limit: 10 };
	const removeOptions = { ordered: true };
	const doc = {
		_id: new ObjectId(),
		name: faker.internet.userName(),
		Age: faker.datatype.number(),
		DOB: faker.date.past()
	};
	const docs = [
		{
			_id: new ObjectId(),
			name: faker.internet.userName(),
			Age: faker.datatype.number(),
			DOB: faker.date.past()
		},
		{
			_id: new ObjectId(),
			name: faker.internet.userName(),
			Age: faker.datatype.number(),
			DOB: faker.date.past()
		}
	];
	const insertOneOptions = { bypassDocumentValidation: true };
	const update = { $set: { name: "Test1" } };
	const updateOption = { upsert: true };
	const pipeline = [{ $match: { Age: dataArr[2].Age } }];
	const aggregateOption = { allowDiskUse: true };

	let mongodbRepository: MongoDBRepository;

	beforeEach(async () => {
		await mongoDBConnect
			.dbContext.collection(collectionName).insertMany(dataArr);
		mongodbRepository = new MongoDBRepositoryImpl(
			mongoDBConnect,
			mongoDBConnect.dbContext
		);
	});

	describe("\"startTransaction\" method", () => {

		describe("Happy Path", () => {
			it("Starts the mongodb transaction", async () => {
				const spyStartSession = jest.spyOn(
					mongodbRepository,
					"startTransaction"
				);

				await mongodbRepository.startTransaction();

				expect(spyStartSession).toHaveBeenCalled();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and start the transaction", async () => {
				const spyStartSession = jest.spyOn(
					mongodbRepository,
					"startTransaction"
				);
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				await mongodbRepository.startTransaction();

				expect(spyStartSession).toHaveBeenCalled();
				expect(spyConnect).toHaveBeenCalled();

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"get\" method", () => {
		describe("Happy Path", () => {
			it("If query is passed, should return the matched document", async () => {
				const data = await mongodbRepository.get(
					collectionName,
					dataArr[0]._id as any
				);

				expect(data).toStrictEqual(dataArr[0]);
			});

			it("If query and options passed, should return the matched document", async () => {
				const data = await mongodbRepository
					.get(
						collectionName,
						dataArr[0]._id as any,
						options
					);

				expect(data).toStrictEqual(dataArr[0]);
			});

			it("If query and options passed with sessions, should return the matched document", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.get(
						collectionName,
						dataArr[0]._id as any,
						options
					);

				expect(data).toStrictEqual(dataArr[0]);

				await mongodbRepository.commitTransaction();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and return the matched document", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository.get(
					collectionName,
					dataArr[0]._id as any
				);

				expect(spyConnect).toHaveBeenCalled();
				expect(data).toStrictEqual(dataArr[0]);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"getAll\" method", () => {
		describe("Happy Path", () => {
			it("If the method is called, should return all the documents", async () => {
				const data = await mongodbRepository.getAll(collectionName);
				expect(data).toStrictEqual(dataArr);
			});

			it("If the method is called with options passed, should return all the documents", async () => {
				const data = await mongodbRepository
					.getAll(collectionName, options);

				expect(data).toStrictEqual(dataArr);
			});

			it("If the method is called with options and sessions passed, should return all the documents", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.getAll(collectionName, options);

				expect(data).toStrictEqual(dataArr);

				await mongodbRepository.commitTransaction();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and return all the documents", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository.getAll(collectionName);

				expect(spyConnect).toHaveBeenCalled();
				expect(data).toStrictEqual(dataArr);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"find\" method", () => {
		describe("Happy Path", () => {
			it("If query is passed, should return the matched document", async () => {
				const data = await mongodbRepository
					.find(collectionName, filter);

				expect(data).toStrictEqual([dataArr[1]]);
			});

			it("If query and options passed, should return the matched document", async () => {
				const data = await mongodbRepository
					.find(collectionName, filter, options);

				expect(data).toStrictEqual([dataArr[1]]);
			});

			it("If query and options passed with sessions, should return the matched document", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.find(collectionName, filter, options);

				expect(data).toStrictEqual([dataArr[1]]);

				await mongodbRepository.commitTransaction();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and return the matched document", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.find(collectionName, filter);

				expect(spyConnect).toHaveBeenCalled();
				expect(data).toStrictEqual([dataArr[1]]);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"countDocuments\" method", () => {
		describe("Happy Path", () => {
			it("If query is passed, should return the document count", async () => {
				const data = await mongodbRepository
					.countDocuments(collectionName, filter);

				expect(data).toBe(1);
			});

			it("If query and options passed, should return the document count", async () => {
				const data = await mongodbRepository
					.countDocuments(collectionName, filter, options);

				expect(data).toBe(1);
			});

			it("If query and options passed with sessions, should return the document count", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.countDocuments(collectionName, filter, options);

				expect(data).toBe(1);

				await mongodbRepository.commitTransaction();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and return the document count", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.countDocuments(collectionName, filter);

				expect(spyConnect).toHaveBeenCalled();
				expect(data).toBe(1);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"aggregate\" method", () => {
		describe("Happy Path", () => {
			it("If pipeline is passed, should return the aggregated document", async () => {
				const data = await mongodbRepository
					.aggregate(collectionName, pipeline);

				expect(data).toStrictEqual([dataArr[2]]);
			});

			it("If pipeline and options passed, should return the aggregated document", async () => {
				const data = await mongodbRepository
					.aggregate(collectionName, pipeline, aggregateOption);

				expect(data).toStrictEqual([dataArr[2]]);
			});

			it("If pipeline and options passed with session, should return the aggregated document", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.aggregate(collectionName, pipeline, aggregateOption);

				expect(data).toStrictEqual([dataArr[2]]);

				await mongodbRepository.commitTransaction();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and return the aggregated document", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.aggregate(collectionName, pipeline);

				expect(spyConnect).toHaveBeenCalled();
				expect(data).toStrictEqual([dataArr[2]]);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"add\" method", () => {
		describe("Happy Path", () => {
			it("If document is passed, should insert given document", async () => {
				const data = await mongodbRepository.add(collectionName, doc);

				expect(data.insertedId).toBe(doc._id);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne({ name: doc.name });

				expect(_data).toStrictEqual(doc);
			});

			it("If document and options passed, should insert given document", async () => {
				const data = await mongodbRepository
					.add(collectionName, doc, insertOneOptions);

				expect(data.insertedId).toBe(doc._id);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne({ name: doc.name });

				expect(_data).toStrictEqual(doc);
			});

			it("If document and options passed with session, should insert given document", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.add(collectionName, doc, insertOneOptions);

				expect(data.insertedId).toBe(doc._id);

				await mongodbRepository.commitTransaction();
				const _data = await mongoDBConnect
					.dbContext.collection(collectionName)
					.findOne({ name: doc.name },);

				expect(_data).toStrictEqual(_data);
			});

			it("If mongodb connection is disconnected, should reconnect the connection and insert given document", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository.add(collectionName, doc);

				expect(spyConnect).toHaveBeenCalled();
				expect(data.insertedId).toBe(doc._id);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne({ name: doc.name });

				expect(_data).toStrictEqual(doc);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"addRange\" method", () => {
		describe("Happy Path", () => {
			it("If documents is passed, should insert given documents", async () => {
				const data = await mongodbRepository
					.addRange(collectionName, docs);

				expect(data.insertedIds[0]).toBe(docs[0]._id);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find({ name: { $in: [docs[0].name, docs[1].name] } });

				expect(await _data.toArray()).toStrictEqual(docs);
			});

			it("If documents and options passed, should insert given documents", async () => {
				const data = await mongodbRepository
					.addRange(collectionName, docs, insertOneOptions);

				expect(data.insertedIds[0]).toBe(docs[0]._id);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find({ name: { $in: [docs[0].name, docs[1].name] } });

				expect(await _data.toArray()).toStrictEqual(docs);
			});

			it("If documents and options passed with session, should insert given documents", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.addRange(collectionName, docs, insertOneOptions);

				expect(data.insertedIds[0]).toBe(docs[0]._id);

				await mongodbRepository.commitTransaction();
				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find({ name: { $in: [docs[0].name, docs[1].name] } });

				expect(await _data.toArray()).toStrictEqual(docs);
			});

			it("If mongodb connection is disconnected, should reconnect the connection and insert given documents", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.addRange(collectionName, docs);

				expect(spyConnect).toHaveBeenCalled();
				expect(data.insertedIds[0]).toBe(docs[0]._id);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find({ name: { $in: [docs[0].name, docs[1].name] } });

				expect(await _data.toArray()).toStrictEqual(docs);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"update\" method", () => {
		describe("Happy Path", () => {
			it("If request is passed, should update the matched document", async () => {
				const data = await mongodbRepository
					.update(collectionName, filter, update);

				expect(data.modifiedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);
			});

			it("If request and options passed, should update the matched document", async () => {
				const data = await mongodbRepository
					.update(collectionName, filter, update, updateOption);

				expect(data.modifiedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);
			});

			it("If request and options passed with session, should update the matched document", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.update(collectionName, filter, update, updateOption);

				expect(data.modifiedCount).toBe(1);

				await mongodbRepository.commitTransaction();

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);
			});

			it("If mongodb connection is disconnected, should reconnect the connection and update the matched document", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.update(collectionName, filter, update);

				expect(spyConnect).toHaveBeenCalled();
				expect(data.modifiedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"updateMany\" method", () => {
		describe("Happy Path", () => {
			it("If request is passed, should update the matched documents", async () => {
				const data = await mongodbRepository
					.updateMany(collectionName, filter, update);

				expect(data.modifiedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);
			});

			it("If request and options passed, should update the matched documents", async () => {
				const data = await mongodbRepository
					.updateMany(collectionName, filter, update, updateOption);

				expect(data.modifiedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);
			});

			it("If request and options passed with sessions, should update the matched documents", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.updateMany(collectionName, filter, update, updateOption);

				expect(data.modifiedCount).toBe(1);

				await mongodbRepository.commitTransaction();

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);
			});

			it("If mongodb connection is disconnected, should reconnect the connection and update the matched documents", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.updateMany(collectionName, filter, update);

				expect(spyConnect).toHaveBeenCalled();
				expect(data.modifiedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data?.name).toBe(update.$set.name);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"remove\" method", () => {
		describe("Happy Path", () => {
			it("If query is passed, should remove the matched document", async () => {
				const data = await mongodbRepository
					.remove(collectionName, filter);

				expect(data.deletedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data).toBe(null);
			});

			it("If query and options passed, should remove the matched document", async () => {
				const data = await mongodbRepository
					.remove(collectionName, filter, removeOptions);

				expect(data.deletedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data).toBe(null);
			});

			it("If query and options passed with sessions, should remove the matched document", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.remove(
						collectionName,
						filter,
						removeOptions
					);

				expect(data.deletedCount).toBe(1);

				await mongodbRepository.commitTransaction();

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data).toBe(null);
			});

			it("If mongodb connection is disconnected, should reconnect the connection and remove the matched document", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.remove(collectionName, filter);

				expect(spyConnect).toHaveBeenCalled();
				expect(data.deletedCount).toBe(1);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.findOne(filter);

				expect(_data).toBe(null);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"removeRange\" method", () => {
		describe("Happy Path", () => {
			it("If query is passed, should remove the matched documents", async () => {
				const data = await mongodbRepository
					.removeRange(collectionName, removeFilter);

				expect(data.deletedCount).toBe(2);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find(removeFilter);

				expect((await _data.toArray()).length).toBe(0);
			});

			it("If query and options passed, should remove the matched documents", async () => {
				const data = await mongodbRepository
					.removeRange(collectionName, removeFilter, removeOptions);

				expect(data.deletedCount).toBe(2);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find(removeFilter);

				expect((await _data.toArray()).length).toBe(0);
			});

			it("If query and options passed with sessions, should remove the matched documents", async () => {
				mongodbRepository.startTransaction();

				const data = await mongodbRepository
					.removeRange(collectionName, removeFilter, removeOptions);

				expect(data.deletedCount).toBe(2);

				await mongodbRepository.commitTransaction();

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find(removeFilter);

				expect((await _data.toArray()).length).toBe(0);
			});

			it("If mongodb connection is disconnected, should reconnect the connection and remove the matched documents", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const data = await mongodbRepository
					.removeRange(collectionName, removeFilter);

				expect(spyConnect).toHaveBeenCalled();
				expect(data.deletedCount).toBe(2);

				const _data = await mongoDBConnect
					.dbContext
					.collection(collectionName)
					.find(removeFilter);

				expect((await _data.toArray()).length).toBe(0);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"commitTransaction\" method", () => {
		describe("Exception Path", () => {
			it("Session not passed, should throw error", async () => {
				await expect(
					() => mongodbRepository.commitTransaction()
				).rejects.toThrow(GenericError);
				await expect(
					() => mongodbRepository.commitTransaction()
				).rejects.toThrow("Cannot commit transaction without starting it.");
			});
		});

		describe("Happy Path", () => {
			it("Commit the transaction session", async () => {
				const spyCommitTransaction = jest
					.spyOn(mongodbRepository, "commitTransaction");

				await mongodbRepository.startTransaction();
				await mongodbRepository.commitTransaction();
				
				expect(spyCommitTransaction).toHaveBeenCalled();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and commit the transaction session", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const spyCommitTransaction = jest
					.spyOn(mongodbRepository, "commitTransaction");

				await mongodbRepository.startTransaction();
				await mongodbRepository.commitTransaction();

				expect(spyCommitTransaction).toHaveBeenCalled();
				expect(spyConnect).toHaveBeenCalled();

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

	describe("\"abortTransaction\" method", () => {
		describe("Exception Path", () => {
			it("Session not passed, should throw error", async () => {
				await expect(
					() => mongodbRepository.abortTransaction()
				).rejects.toThrow(GenericError);
				await expect(
					() => mongodbRepository.abortTransaction()
				).rejects.toThrow("Cannot abort transaction without starting it.");
			});
		});

		describe("Happy Path", () => {
			it("Abort the transaction session", async () => {
				const spyAbortTransaction = jest
					.spyOn(mongodbRepository, "abortTransaction");

				await mongodbRepository.startTransaction();
				await mongodbRepository.abortTransaction();
				expect(spyAbortTransaction).toHaveBeenCalled();
			});

			it("If mongodb connection is disconnected, should reconnect the connection and abort the transaction session", async () => {
				const spyConnect = jest.spyOn(
					mongoDBConnect,
					"connect"
				);

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.disconnected;

				const spyAbortTransaction = jest
					.spyOn(mongodbRepository, "abortTransaction");

				await mongodbRepository.startTransaction();
				await mongodbRepository.abortTransaction();

				expect(spyAbortTransaction).toHaveBeenCalled();
				expect(spyConnect).toHaveBeenCalled();

				mongoDBConnect.connectionState = 
					MongoDBConnectionStates.connected;
			});
		});
	});

});