import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DeleteCallAnalyticsJobRequest,
  DeleteCallAnalyticsJobResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteCallAnalyticsJobCommandInput
  extends DeleteCallAnalyticsJobRequest {}
export interface DeleteCallAnalyticsJobCommandOutput
  extends DeleteCallAnalyticsJobResponse,
    __MetadataBearer {}
declare const DeleteCallAnalyticsJobCommand_base: {
  new (
    input: DeleteCallAnalyticsJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteCallAnalyticsJobCommandInput,
    DeleteCallAnalyticsJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteCallAnalyticsJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteCallAnalyticsJobCommandInput,
    DeleteCallAnalyticsJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteCallAnalyticsJobCommand extends DeleteCallAnalyticsJobCommand_base {
  protected static __types: {
    api: {
      input: DeleteCallAnalyticsJobRequest;
      output: {};
    };
    sdk: {
      input: DeleteCallAnalyticsJobCommandInput;
      output: DeleteCallAnalyticsJobCommandOutput;
    };
  };
}
