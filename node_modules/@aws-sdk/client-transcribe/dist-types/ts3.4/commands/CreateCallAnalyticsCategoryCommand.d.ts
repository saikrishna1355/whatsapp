import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CreateCallAnalyticsCategoryRequest,
  CreateCallAnalyticsCategoryResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface CreateCallAnalyticsCategoryCommandInput
  extends CreateCallAnalyticsCategoryRequest {}
export interface CreateCallAnalyticsCategoryCommandOutput
  extends CreateCallAnalyticsCategoryResponse,
    __MetadataBearer {}
declare const CreateCallAnalyticsCategoryCommand_base: {
  new (
    input: CreateCallAnalyticsCategoryCommandInput
  ): import("@smithy/core/client").CommandImpl<
    CreateCallAnalyticsCategoryCommandInput,
    CreateCallAnalyticsCategoryCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CreateCallAnalyticsCategoryCommandInput
  ): import("@smithy/core/client").CommandImpl<
    CreateCallAnalyticsCategoryCommandInput,
    CreateCallAnalyticsCategoryCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class CreateCallAnalyticsCategoryCommand extends CreateCallAnalyticsCategoryCommand_base {
  protected static __types: {
    api: {
      input: CreateCallAnalyticsCategoryRequest;
      output: CreateCallAnalyticsCategoryResponse;
    };
    sdk: {
      input: CreateCallAnalyticsCategoryCommandInput;
      output: CreateCallAnalyticsCategoryCommandOutput;
    };
  };
}
