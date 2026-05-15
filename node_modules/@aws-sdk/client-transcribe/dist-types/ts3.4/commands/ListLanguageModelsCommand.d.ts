import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListLanguageModelsRequest,
  ListLanguageModelsResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface ListLanguageModelsCommandInput
  extends ListLanguageModelsRequest {}
export interface ListLanguageModelsCommandOutput
  extends ListLanguageModelsResponse,
    __MetadataBearer {}
declare const ListLanguageModelsCommand_base: {
  new (
    input: ListLanguageModelsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListLanguageModelsCommandInput,
    ListLanguageModelsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListLanguageModelsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListLanguageModelsCommandInput,
    ListLanguageModelsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListLanguageModelsCommand extends ListLanguageModelsCommand_base {
  protected static __types: {
    api: {
      input: ListLanguageModelsRequest;
      output: ListLanguageModelsResponse;
    };
    sdk: {
      input: ListLanguageModelsCommandInput;
      output: ListLanguageModelsCommandOutput;
    };
  };
}
