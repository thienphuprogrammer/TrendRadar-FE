import { IConfig } from '@/lib/apollo/server/config';
import {
  IIbisAdaptor,
  IWrenAIAdaptor,
  IWrenEngineAdaptor,
} from '@/lib/apollo/server/adaptors';
import {
  IModelColumnRepository,
  IModelNestedColumnRepository,
  IModelRepository,
  IProjectRepository,
  IRelationRepository,
  IViewRepository,
  ILearningRepository,
  ISchemaChangeRepository,
  IDeployLogRepository,
  IDashboardRepository,
  IDashboardItemRepository,
  ISqlPairRepository,
  IInstructionRepository,
  IApiHistoryRepository,
  IDashboardItemRefreshJobRepository,
} from '@/lib/apollo/server/repositories';
import {
  IQueryService,
  IAskingService,
  IDeployService,
  IModelService,
  IMDLService,
  IProjectService,
  IDashboardService,
  IInstructionService,
} from '@/lib/apollo/server/services';
import { ITelemetry } from '@/lib/apollo/server/telemetry/telemetry';
import {
  ProjectRecommendQuestionBackgroundTracker,
  ThreadRecommendQuestionBackgroundTracker,
  DashboardCacheBackgroundTracker,
} from '@/lib/apollo/server/backgrounds';
import { ISqlPairService } from '../services/sqlPairService';

export interface IContext {
  config: IConfig;
  // telemetry
  telemetry: ITelemetry;

  // adaptor
  wrenEngineAdaptor: IWrenEngineAdaptor;
  ibisServerAdaptor: IIbisAdaptor;
  wrenAIAdaptor: IWrenAIAdaptor;

  // services
  projectService: IProjectService;
  modelService: IModelService;
  mdlService: IMDLService;
  deployService: IDeployService;
  askingService: IAskingService;
  queryService: IQueryService;
  dashboardService: IDashboardService;
  sqlPairService: ISqlPairService;
  instructionService: IInstructionService;

  // repository
  projectRepository: IProjectRepository;
  modelRepository: IModelRepository;
  modelColumnRepository: IModelColumnRepository;
  modelNestedColumnRepository: IModelNestedColumnRepository;
  relationRepository: IRelationRepository;
  viewRepository: IViewRepository;
  deployRepository: IDeployLogRepository;
  schemaChangeRepository: ISchemaChangeRepository;
  learningRepository: ILearningRepository;
  dashboardRepository: IDashboardRepository;
  dashboardItemRepository: IDashboardItemRepository;
  sqlPairRepository: ISqlPairRepository;
  instructionRepository: IInstructionRepository;
  apiHistoryRepository: IApiHistoryRepository;
  dashboardItemRefreshJobRepository: IDashboardItemRefreshJobRepository;

  // background trackers
  projectRecommendQuestionBackgroundTracker: ProjectRecommendQuestionBackgroundTracker;
  threadRecommendQuestionBackgroundTracker: ThreadRecommendQuestionBackgroundTracker;
  dashboardCacheBackgroundTracker: DashboardCacheBackgroundTracker;
}
