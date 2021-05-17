import express from 'express';
import expressJwt from 'express-jwt'
import path from 'path';

import nextApp from '@ant-photos/client';
import apolloServer from '@ant-photos/graphql/src/server';

async function bootstrapNextApp(expressApp) {
    await nextApp.prepare();
    expressApp.get('*', nextApp.getRequestHandler());
}

async function bootstrapApolloServer(expressApp) {
    apolloServer.applyMiddleware({ app: expressApp });    
}

async function main() {
    const app = express();
    app.use(expressJwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        credentialsRequired: false
    }))

    const uploadPath = path.join(__dirname, '../graphql/public/photos');
    app.use('/photos', express.static(uploadPath));

    await bootstrapApolloServer(app);
    await bootstrapNextApp(app);

    const port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`Server ready at http://localhost:${port}`);
    });
}

main();
