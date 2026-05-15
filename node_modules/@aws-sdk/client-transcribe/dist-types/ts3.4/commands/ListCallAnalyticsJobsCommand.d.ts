import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListCallAnalyticsJobsRequest,
  ListCallAnalyticsJobsResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface ListCallAnalyticsJobsCommandInput
  extends ListCallAnalyticsJobsRequest {}
export interface ListCallAnalyticsJobsCommandOutput
  extends ListCallAnalyticsJobsResponse,
    __MetadataBearer {}
declare const ListCallAnalyticsJobsCommand_base: {
  new (
    input: ListCallAnalyticsJobsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListCallAnalyticsJobsCommandInput,
    ListCallAnalyticsJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListCallAnalyticsJobsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListCallAnalyticsJobsCommandInput,
    ListCallAnalyticsJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListCallAnalyticsJobsCommand extends ListCallAnalyticsJobsCommand_base {
  protected static __types: {
    api: {
      input: ListCallAnalyticsJobsRequest;
      output: ListCallAnalyticsJobsResponse;
    };
    sdk: {
      input: ListCallAnalyticsJobsCommandInput;
      output: ListCallAnalyticsJobsCommandOutput;
    };
  };
}
