import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  StartCallAnalyticsJobRequest,
  StartCallAnalyticsJobResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface StartCallAnalyticsJobCommandInput
  extends StartCallAnalyticsJobRequest {}
export interface StartCallAnalyticsJobCommandOutput
  extends StartCallAnalyticsJobResponse,
    __MetadataBearer {}
declare const StartCallAnalyticsJobCommand_base: {
  new (
    input: StartCallAnalyticsJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    StartCallAnalyticsJobCommandInput,
    StartCallAnalyticsJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: StartCallAnalyticsJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    StartCallAnalyticsJobCommandInput,
    StartCallAnalyticsJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class StartCallAnalyticsJobCommand extends StartCallAnalyticsJobCommand_base {
  protected static __types: {
    api: {
      input: StartCallAnalyticsJobRequest;
      output: StartCallAnalyticsJobResponse;
    };
    sdk: {
      input: StartCallAnalyticsJobCommandInput;
      output: StartCallAnalyticsJobCommandOutput;
    };
  };
}
