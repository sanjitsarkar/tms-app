import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import compression from 'compression';
import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers';
import { getUser } from './middleware/auth';
import { Context } from './types';

const PORT = process.env.PORT || 4000;

async function startServer() {
    const app = express();

    // Create Apollo Server
    const server = new ApolloServer<Context>({
        typeDefs,
        resolvers,
        introspection: true, // Enable introspection for GraphQL Playground
        plugins: [
            {
                async requestDidStart() {
                    return {
                        async willSendResponse(requestContext) {
                            // Log request duration for performance monitoring
                            const { request, response } = requestContext;
                            if (request.operationName) {
                                console.log(`[GraphQL] ${request.operationName} completed`);
                            }
                        }
                    };
                }
            }
        ]
    });

    // Start Apollo Server
    await server.start();

    // Middleware
    app.use(compression());
    app.use(cors({
        origin: '*', // Allow all origins for demo
        credentials: true
    }));
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (_req: Request, res: Response) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // GraphQL endpoint
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }): Promise<Context> => {
            const user = await getUser(req);
            return { user };
        }
    }));

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 TMS Server ready at http://localhost:${PORT}/graphql`);
        console.log(`📊 Health check at http://localhost:${PORT}/health`);
        console.log('\n📧 Demo Accounts:');
        console.log('   Admin: admin@tms.com / admin123');
        console.log('   Employee: employee@tms.com / employee123');
    });
}

startServer().catch(console.error);
