module.exports = {
    mongoClient: null,
    app: null,
    database: "musicStore",
    collectionName: "favorite_songs",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },getFavoriteSongs: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoriteSongsCollection = database.collection(this.collectionName);
            const favoriteSongs = await favoriteSongsCollection.find(filter,options).toArray();
            return favoriteSongs;
        } catch (error) {
            throw (error);
        }
    },insertFavoriteSong: function (favoriteSong, callbackFunction) {
        this.dbClient.connect()
            .then(() => {
                const database = this.dbClient.db(this.database);
                const favoriteSongsCollection = database.collection(this.collectionName);
                favoriteSongsCollection.insertOne(favoriteSong)
                    .then(result => callbackFunction({songId: result.insertedId}))
                    .then(() => this.dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            })
            .catch(err => callbackFunction({error: err.message}))
    }, deleteFavoriteSong: async function (filter,options){
        try{
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoriteSongsCollection = database.collection(this.collectionName);
            const favoriteSong = await favoriteSongsCollection.deleteOne(filter,options);
            return favoriteSong;
        }catch (error){
            throw (error);
        }
    },findFavoriteSong: async function (filter, options) {
    try {
        await this.dbClient.connect();
        const database = this.dbClient.db(this.database);
        const favoriteSongsCollection = database.collection(this.collectionName);
        const favoriteSong = await favoriteSongsCollection.findOne(filter, options);
        return favoriteSong;
    } catch (error) {
        throw (error);
    }
},
};