module.exports = {
    Query: {
        photoAlbumList: async (_, query, { dataSources }) => {
            const allAlbums = await dataSources.photoAlbumAPI.getAll(query);
            return allAlbums;
        },
    },
    Mutation: {
        createPhotoAlbum: async (_, { input }, { dataSources }) => {
            const photoAlbum = await dataSources.photoAlbumAPI.create(input);
            return {
                id: photoAlbum.id,
                name: photoAlbum.name,
                description: photoAlbum.description,
            }
        },
        updatePhotoAlbum: async (_, { id, input }, { dataSources }) => {
            const photoAlbum = await dataSources.photoAlbumAPI.update(id, input);
            return {
                id: photoAlbum.id,
                name: photoAlbum.name,
                description: photoAlbum.description,
            }
        },
        deletePhotoAlbum: async (_, { id }, { dataSources }) => {
            try {
                const result = await dataSources.photoAlbumAPI.delete(id);
                return result
            } catch (error) {
                return false;
            }
        }, 
    },
};
