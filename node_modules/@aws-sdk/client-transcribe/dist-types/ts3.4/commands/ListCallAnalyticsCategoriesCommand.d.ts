import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListCallAnalyticsCategoriesRequest,
  ListCallAnalyticsCategoriesResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface ListCallAnalyticsCategoriesCommandInput
  extends ListCallAnalyticsCategoriesRequest {}
export interface ListCallAnalyticsCategoriesCommandOutput
  extends ListCallAnalyticsCategoriesResponse,
    __MetadataBearer {}
declare const ListCallAnalyticsCategoriesCommand_base: {
  new (
    input: ListCallAnalyticsCategoriesCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListCallAnalyticsCategoriesCommandInput,
    ListCallAnalyticsCategoriesCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListCallAnalyticsCategoriesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListCallAnalyticsCategoriesCommandInput,
    ListCallAnalyticsCategoriesCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListCallAnalyticsCategoriesCommand extends ListCallAnalyticsCategoriesCommand_base {
  protected static __types: {
    api: {
      input: ListCallAnalyticsCategoriesRequest;
      output: ListCallAnalyticsCategoriesResponse;
    };
    sdk: {
      input: ListCallAnalyticsCategoriesCommandInput;
      output: ListCallAnalyticsCategoriesCommandOutput;
    };
  };
}
