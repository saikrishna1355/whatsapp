import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetCallAnalyticsCategoryRequest,
  GetCallAnalyticsCategoryResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface GetCallAnalyticsCategoryCommandInput
  extends GetCallAnalyticsCategoryRequest {}
export interface GetCallAnalyticsCategoryCommandOutput
  extends GetCallAnalyticsCategoryResponse,
    __MetadataBearer {}
declare const GetCallAnalyticsCategoryCommand_base: {
  new (
    input: GetCallAnalyticsCategoryCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetCallAnalyticsCategoryCommandInput,
    GetCallAnalyticsCategoryCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetCallAnalyticsCategoryCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetCallAnalyticsCategoryCommandInput,
    GetCallAnalyticsCategoryCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetCallAnalyticsCategoryCommand extends GetCallAnalyticsCategoryCommand_base {
  protected static __types: {
    api: {
      input: GetCallAnalyticsCategoryRequest;
      output: GetCallAnalyticsCategoryResponse;
    };
    sdk: {
      input: GetCallAnalyticsCategoryCommandInput;
      output: GetCallAnalyticsCategoryCommandOutput;
    };
  };
}
