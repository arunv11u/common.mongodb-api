/* eslint-disable max-lines */
import {
	Db,
	Document,
	WithId,
	ClientSession,
	Filter,
	OptionalUnlessRequiredId,
	InsertOneResult,
	InsertManyResult,
	UpdateFilter,
	UpdateResult,
	DeleteResult,
	FindOptions,
	CountDocumentsOptions,
	InsertOneOptions,
	BulkWriteOptions,
	UpdateOptions,
	DeleteOptions,
	AggregateOptions,
	FindOneAndUpdateOptions,
	AnyBulkWriteOperation
} from "mongodb";
import { MongoDBConnect, MongoDBRepository } from "../utils";
import { GenericError } from "../utils/errors";
import { ErrorCodes } from "../utils/types/errors";



class MongoDBRepositoryImpl implements MongoDBRepository {

	private _mongoDBConnect: MongoDBConnect;
	private _db: Db;
	private _session: ClientSession | null = null;

	constructor(mongoDBConnect: MongoDBConnect, db: Db) {
		this._mongoDBConnect = mongoDBConnect;
		this._db = db;
	}
	// eslint-disable-next-line max-params
	async findOneAndUpdate<T>(
		collectionName: string,
		filter: Filter<T>,
		update: UpdateFilter<T>,
		options?: FindOneAndUpdateOptions
	): Promise<WithId<T> | null> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.findOneAndUpdate(
				filter as Filter<Document>,
				update as UpdateFilter<Document>,
				{ returnDocument: "after", session: this._session ?? undefined },

			);

		return data as (WithId<T> | null);
	}

	async startTransaction(): Promise<void> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		this._session = this._mongoDBConnect.mongoClient.startSession();
		this._session.startTransaction();
	}

	async get<T>(
		collectionName: string,
		id: WithId<T>["_id"]
	): Promise<WithId<T> | null>
	async get<T>(
		collectionName: string,
		id: WithId<T>["_id"], options?: FindOptions<Document>
	): Promise<WithId<T> | null> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db.
			collection(collectionName)
			.findOne(
				{
					$and: [{ _id: id }]
				},
				{ ...options, session: this._session ?? undefined }
			);

		return data as (WithId<T> | null);
	}

	async getAll<T>(
		collectionName: string
	): Promise<WithId<T>[]>
	async getAll<T>(
		collectionName: string,
		options?: FindOptions<Document>
	): Promise<WithId<T>[]> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const cursor = this._db
			.collection(collectionName)
			.find(
				{},
				{ ...options, session: this._session ?? undefined }
			);
		const data = await cursor.toArray();

		return data as WithId<T>[];
	}

	async find<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<WithId<T>[]>
	async find<T>(
		collectionName: string,
		filter: Filter<T>,
		options?: FindOptions<Document>
	): Promise<WithId<T>[]> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const cursor = await this._db
			.collection(collectionName)
			.find(
				filter as Filter<Document>,
				{ ...options, session: this._session ?? undefined }
			);

		const data = await cursor.toArray();

		return data as WithId<T>[];
	}

	async findOne<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<WithId<T> | null>
	async findOne<T>(
		collectionName: string,
		filter: Filter<T>,
		options?: FindOptions<Document>
	): Promise<WithId<T> | null> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.findOne(
				filter as Filter<Document>,
				{ ...options, session: this._session ?? undefined }
			);

		return data as (WithId<T> | null);
	}

	async countDocuments<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<number>
	async countDocuments<T>(
		collectionName: string,
		filter: Filter<T>,
		options?: CountDocumentsOptions
	): Promise<number> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const number = await this._db
			.collection(collectionName)
			.countDocuments(
				filter as Filter<Document>,
				{ ...options, session: this._session ?? undefined }
			);

		return number;
	}

	async aggregate(
		collectionName: string,
		pipeline: Document[]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): Promise<any[]>
	async aggregate(
		collectionName: string,
		pipeline: Document[],
		options?: AggregateOptions
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): Promise<any[]> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const cursor = await this._db
			.collection(collectionName)
			.aggregate(
				pipeline,
				{ ...options, session: this._session ?? undefined }
			);

		const data = await cursor.toArray();

		return data;
	}

	async add<T>(
		collectionName: string,
		doc: OptionalUnlessRequiredId<T>
	): Promise<InsertOneResult<T>>
	async add<T>(
		collectionName: string,
		doc: OptionalUnlessRequiredId<T>,
		options?: InsertOneOptions
	): Promise<InsertOneResult<T>> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.insertOne(
				doc,
				{ ...options, session: this._session ?? undefined }
			);

		return data as InsertOneResult<T>;
	}

	async addRange<T>(
		collectionName: string,
		docs: OptionalUnlessRequiredId<T>[]
	): Promise<InsertManyResult<T>>
	async addRange<T>(
		collectionName: string,
		docs: OptionalUnlessRequiredId<T>[],
		options?: BulkWriteOptions
	): Promise<InsertManyResult<T>> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.insertMany(
				docs,
				{ ...options, session: this._session ?? undefined }
			);

		return data as InsertManyResult<T>;
	}

	async update<T>(
		collectionName: string,
		filter: Filter<T>,
		update: Partial<T> | UpdateFilter<T>
	): Promise<UpdateResult>
	// eslint-disable-next-line max-params
	async update<T>(
		collectionName: string,
		filter: Filter<T>,
		update: Partial<T> | UpdateFilter<T>,
		options?: UpdateOptions
	): Promise<UpdateResult> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.updateOne(
				filter as Filter<Document>,
				update as UpdateFilter<Document>,
				{ ...options, session: this._session ?? undefined }
			);

		return data;
	}

	async updateMany<T>(
		collectionName: string,
		filter: Filter<T>,
		update: UpdateFilter<T>
	): Promise<Document | UpdateResult>
	// eslint-disable-next-line max-params
	async updateMany<T>(
		collectionName: string,
		filter: Filter<T>,
		update: UpdateFilter<T>,
		options?: UpdateOptions
	): Promise<Document | UpdateResult> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.updateMany(
				filter as Filter<Document>,
				update as UpdateFilter<Document>,
				{ ...options, session: this._session ?? undefined }
			);

		return data;
	}

	async remove<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<DeleteResult>
	async remove<T>(
		collectionName: string,
		filter: Filter<T>,
		options?: DeleteOptions
	): Promise<DeleteResult> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.deleteOne(
				filter as Filter<Document>,
				{ ...options, session: this._session ?? undefined }
			);

		return data;
	}

	async removeRange<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<DeleteResult>
	async removeRange<T>(
		collectionName: string,
		filter: Filter<T>,
		options?: DeleteOptions
	): Promise<DeleteResult> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		const data = await this._db
			.collection(collectionName)
			.deleteMany(
				filter as Filter<Document>,
				{ ...options, session: this._session ?? undefined }
			);

		return data;
	}

	async bulkWrite(
		collectionName: string,
		operations: AnyBulkWriteOperation[]
	): Promise<void>
	async bulkWrite(
		collectionName: string,
		operations: AnyBulkWriteOperation[],
		options?: BulkWriteOptions
	): Promise<void> {
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		await this._db.collection(collectionName)
			.bulkWrite(
				operations,
				{ ...options, session: this._session ?? undefined }
			)
	}

	async commitTransaction(): Promise<void> {
		if (!this._session)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot commit transaction without starting it."),
				errorCode: 500
			});
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		await this._session.commitTransaction();
		await this._session.endSession();
	}

	async abortTransaction(): Promise<void> {
		if (!this._session)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot abort transaction without starting it."),
				errorCode: 500
			});
		if (!this._mongoDBConnect.isConnected())
			await this._mongoDBConnect.reconnect();

		await this._session.abortTransaction();
		await this._session.endSession();
	}
}


export {
	MongoDBRepositoryImpl
};
