/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AggregateOptions,
	BulkWriteOptions,
	CountDocumentsOptions,
	Document,
	DeleteOptions,
	DeleteResult,
	Filter,
	FindOptions,
	InsertManyResult,
	InsertOneOptions,
	InsertOneResult,
	OptionalUnlessRequiredId,
	UpdateFilter,
	UpdateOptions,
	UpdateResult,
	WithId,
	ModifyResult,
	FindOneAndUpdateOptions
} from "mongodb";


export abstract class MongoDBRepository {

	abstract startTransaction(): Promise<void>;

	abstract get<T>(
		collectionName: string,
		id: WithId<T>["_id"]
	): Promise<WithId<T> | null>;

	abstract get<T>(
		collectionName: string,
		id: WithId<T>["_id"],
		options: FindOptions<Document>
	): Promise<WithId<T> | null>;

	abstract getAll<T>(
		collectionName: string
	): Promise<WithId<T>[]>;

	abstract getAll<T>(
		collectionName: string,
		options: FindOptions<Document>
	): Promise<WithId<T>[]>;

	abstract find<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<WithId<T>[]>;

	abstract find<T>(
		collectionName: string,
		filter: Filter<T>,
		options: FindOptions<Document>
	): Promise<WithId<T>[]>;

	abstract findOne<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<WithId<T> | null>;

	abstract findOne<T>(
		collectionName: string,
		filter: Filter<T>,
		options: FindOptions<Document>
	): Promise<WithId<T> | null>;

	abstract findOneAndUpdate<T>(
		collectionName: string,
		filter: Filter<T>,
		update: UpdateFilter<T>,
		options?: FindOneAndUpdateOptions,
	): Promise<WithId<T> | null>;

	abstract countDocuments<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<number>;

	abstract countDocuments<T>(
		collectionName: string,
		filter: Filter<T>,
		options: CountDocumentsOptions
	): Promise<number>;

	abstract aggregate(
		collectionName: string,
		pipeline: Document[]
	): Promise<any[]>;

	abstract aggregate(
		collectionName: string,
		pipeline: Document[],
		options: AggregateOptions
	): Promise<any[]>;

	abstract add<T>(
		collectionName: string,
		doc: OptionalUnlessRequiredId<T>
	): Promise<InsertOneResult<T>>;

	abstract add<T>(
		collectionName: string,
		doc: OptionalUnlessRequiredId<T>,
		options: InsertOneOptions
	): Promise<InsertOneResult<T>>;

	abstract addRange<T>(
		collectionName: string,
		docs: OptionalUnlessRequiredId<T>[]
	): Promise<InsertManyResult<T>>;

	abstract addRange<T>(
		collectionName: string,
		docs: OptionalUnlessRequiredId<T>[],
		options: BulkWriteOptions
	): Promise<InsertManyResult<T>>;

	abstract update<T>(
		collectionName: string,
		filter: Filter<T>,
		update: Partial<T> | UpdateFilter<T>
	): Promise<UpdateResult>;

	abstract update<T>(
		collectionName: string,
		filter: Filter<T>,
		update: Partial<T> | UpdateFilter<T>,
		options: UpdateOptions
	): Promise<UpdateResult>;

	abstract updateMany<T>(
		collectionName: string,
		filter: Filter<T>,
		update: UpdateFilter<T>
	): Promise<Document | UpdateResult>;

	abstract updateMany<T>(
		collectionName: string,
		filter: Filter<T>,
		update: UpdateFilter<T>,
		options: UpdateOptions
	): Promise<Document | UpdateResult>;

	abstract remove<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<DeleteResult>;

	abstract remove<T>(
		collectionName: string,
		filter: Filter<T>,
		options: DeleteOptions
	): Promise<DeleteResult>;

	abstract removeRange<T>(
		collectionName: string,
		filter: Filter<T>
	): Promise<DeleteResult>;

	abstract removeRange<T>(
		collectionName: string,
		filter: Filter<T>,
		options: DeleteOptions
	): Promise<DeleteResult>;

	abstract commitTransaction(): Promise<void>;
	abstract abortTransaction(): Promise<void>;
}
