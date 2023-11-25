from pymongo import MongoClient
from bson.objectid import ObjectId

class MongoDB_Handler:
    def __init__(self, config):
        self.URI = config['MONGODB_URI']
        self.db_name = config['DATABASE_NAME']
        self.collectionName = config['COLLECTION_NAME']

        self.client = self._create_client(self.URI)
        self.db = self._create_db(self.client, self.db_name)
        self.collection = self._create_collection(self.db, self.collectionName)
        print(f"[mongo] Connected to {self.URI}, db: {self.db}, collection: {self.collectionName}")
    def _create_client(self, URI):
        return MongoClient(URI)
    
    def _create_db(self, client, dbName):
        return client[dbName]
    
    def _create_collection(self, db, collectionName):
        return db[collectionName]
    
    def update_document_by_id(self, id, data):
        try:

            res = self.collection.update_one({'_id': ObjectId(id)}, {'$push': { 'votes': data }})
            print(f"[mongo] {res.modified_count} document updated")
        except Exception as e:
            print(e)
            return False
        return True
    
    def get_document_by_id(self, id):
        try:
            return self.collection.find_one({'_id': id})
        except Exception as e:
            print(e)
            return None

    def insert(self, data):
        self.collection.insert_one(data)
    
    def close_client(self):
        self.client.close()