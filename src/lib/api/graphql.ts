import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/lib/apollo/server';
import resolvers from '@/lib/apollo/server/resolvers';
import { IContext } from '@/lib/apollo/server/types';
import { GraphQLError } from 'graphql';
import { getLogger } from '@/lib/apollo/server/utils';
import { getConfig } from '@/lib/apollo/server/config';
import { ModelService } from '@/lib/apollo/server/services/modelService';
import {
  defaultApolloErrorHandler,
  GeneralErrorCodes,
} from '@/lib/apollo/server/utils/error';
import { TelemetryEvent } from '@/lib/apollo/server/telemetry/telemetry';
import { components } from '@/common';

const serverConfig = getConfig();
const logger = getLogger('APOLLO');
logger.level = 'debug';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const bootstrapServer = async () => {
  const {
    telemetry,

    // repositories
    projectRepository,
    modelRepository,
    modelColumnRepository,
    relationRepository,
    deployLogRepository,
    viewRepository,
    schemaChangeRepository,
    learningRepository,
    modelNestedColumnRepository,
    dashboardRepository,
    dashboardItemRepository,
    sqlPairRepository,
    instructionRepository,
    apiHistoryRepository,
    dashboardItemRefreshJobRepository,
    // adaptors
    wrenEngineAdaptor,
    ibisAdaptor,
    wrenAIAdaptor,

    // services
    projectService,
    queryService,
    askingService,
    deployService,
    mdlService,
    dashboardService,
    sqlPairService,

    instructionService,
    // background trackers
    projectRecommendQuestionBackgroundTracker,
    threadRecommendQuestionBackgroundTracker,
    dashboardCacheBackgroundTracker,
  } = components;

  const modelService = new ModelService({
    projectService,
    modelRepository,
    modelColumnRepository,
    relationRepository,
    viewRepository,
    mdlService,
    wrenEngineAdaptor,
    queryService,
  });

  // initialize services
  await Promise.all([
    askingService.initialize(),
    projectRecommendQuestionBackgroundTracker.initialize(),
    threadRecommendQuestionBackgroundTracker.initialize(),
  ]);

  const apolloServer: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error: GraphQLError) => {
      // stop print error stacktrace of dry run error
      if (error.extensions?.code === GeneralErrorCodes.DRY_RUN_ERROR) {
        return defaultApolloErrorHandler(error);
      }

      // print error stacktrace of graphql error
      const stacktrace = error.extensions?.exception?.stacktrace;
      if (stacktrace) {
        logger.error(stacktrace.join('\n'));
      }

      // print original error stacktrace
      const originalError = error.extensions?.originalError as Error;
      if (originalError) {
        logger.error(`== original error ==`);
        // error may not have stack, so print error message if stack is not available
        logger.error(originalError.stack || originalError.message);
      }

      // telemetry: capture internal server error
      if (error.extensions?.code === GeneralErrorCodes.INTERNAL_SERVER_ERROR) {
        telemetry.sendEvent(
          TelemetryEvent.GRAPHQL_ERROR,
          {
            originalErrorStack: originalError?.stack,
            originalErrorMessage: originalError?.message,
            errorMessage: error.message,
          },
          error.extensions?.service,
          false,
        );
      }
      return defaultApolloErrorHandler(error);
    },
    introspection: process.env.NODE_ENV !== 'production',
    context: (): IContext => ({
      config: serverConfig,
      telemetry,
      // adaptor
      wrenEngineAdaptor,
      ibisServerAdaptor: ibisAdaptor,
      wrenAIAdaptor,
      // services
      projectService,
      modelService,
      mdlService,
      deployService,
      askingService,
      queryService,
      dashboardService,
      sqlPairService,
      instructionService,
      // repository
      projectRepository,
      modelRepository,
      modelColumnRepository,
      modelNestedColumnRepository,
      relationRepository,
      viewRepository,
      deployRepository: deployLogRepository,
      schemaChangeRepository,
      learningRepository,
      dashboardRepository,
      dashboardItemRepository,
      sqlPairRepository,
      instructionRepository,
      apiHistoryRepository,
      dashboardItemRefreshJobRepository,
      // background trackers
      projectRecommendQuestionBackgroundTracker,
      threadRecommendQuestionBackgroundTracker,
      dashboardCacheBackgroundTracker,
    }),
  });
  await apolloServer.start();
  return apolloServer;
};

const startServer = bootstrapServer();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apolloServer = await startServer;
  const nextHandler = startServerAndCreateNextHandler(apolloServer, {
    context: async () => ({}),
  });
  return nextHandler(req, res);
}
