# @arunvaradharajalu/common.mongodb-api

[![npm version](https://badge.fury.io/js/%40arunvaradharajalu%2Fcommon.mongodb-api.svg)](https://badge.fury.io/js/%40arunvaradharajalu%2Fcommon.mongodb-api)
[![GitHub issues](https://img.shields.io/github/issues/arunv11u/common.mongodb-api)](https://github.com/arunv11u/common.errors/mongodb-api)
[![GitHub license](https://img.shields.io/github/license/arunv11u/common.mongodb-api)](https://github.com/arunv11u/common.mongodb-api/blob/master/LICENSE)

This package provides a wrapper for the MongoDB module, simplifying the usage of MongoDB operations within your Node.js applications.

## Installation

You can install this package using npm:

```bash
npm install @arunvaradharajalu/common.mongodb-api
```

## Usage

### Setting Up the MongoDB Connection

First, initialize and configure the MongoDB connection:

```typescript
import { mongoDBConnect } from "@arunvaradharajalu/common.mongodb-api";

// Set connection details
mongoDBConnect.url = "your-mongodb-url";
mongoDBConnect.dbName = "your-database-name";
mongoDBConnect.username = "your-username";
mongoDBConnect.password = "your-password";

// Initialize and connect
mongoDBConnect.init();
await mongoDBConnect.connect();
```

### Using the MongoDB Repository

Once the connection is established, you can use the MongoDBRepositoryImpl class to perform CRUD operations.

```typescript
import { MongoDBRepositoryImpl } from "@arunvaradharajalu/common.mongodb-api";

const db = mongoDBConnect.dbContext;
const repository = new MongoDBRepositoryImpl(mongoDBConnect, db);

// Example: Insert a document
await repository.add("your-collection-name", { key: "value" });

// Example: Find a document by ID
const document = await repository.get("your-collection-name", "document-id");
console.log(document);

// Example: Update a document
await repository.update("your-collection-name", { key: "value" }, { $set: { key: "new-value" } });

// Example: Delete a document
await repository.remove("your-collection-name", { key: "value" });
```

## Features

- Simplified MongoDB connection handling
- CRUD operations for MongoDB collections
- Transaction support
- Aggregation operations

## Running Tests

To run the tests, use:

```bash
npm test
```

The test results will be generated in an HTML report with the title "MongoDB API Test Report".

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for bug fixes, improvements, or new features.

## Author

Arun Varadharajalu

## License

This project is licensed under the ISC License.