import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DeleteCallAnalyticsCategoryRequest,
  DeleteCallAnalyticsCategoryResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteCallAnalyticsCategoryCommandInput
  extends DeleteCallAnalyticsCategoryRequest {}
export interface DeleteCallAnalyticsCategoryCommandOutput
  extends DeleteCallAnalyticsCategoryResponse,
    __MetadataBearer {}
declare const DeleteCallAnalyticsCategoryCommand_base: {
  new (
    input: DeleteCallAnalyticsCategoryCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteCallAnalyticsCategoryCommandInput,
    DeleteCallAnalyticsCategoryCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteCallAnalyticsCategoryCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteCallAnalyticsCategoryCommandInput,
    DeleteCallAnalyticsCategoryCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteCallAnalyticsCategoryCommand extends DeleteCallAnalyticsCategoryCommand_base {
  protected static __types: {
    api: {
      input: DeleteCallAnalyticsCategoryRequest;
      output: {};
    };
    sdk: {
      input: DeleteCallAnalyticsCategoryCommandInput;
      output: DeleteCallAnalyticsCategoryCommandOutput;
    };
  };
}
