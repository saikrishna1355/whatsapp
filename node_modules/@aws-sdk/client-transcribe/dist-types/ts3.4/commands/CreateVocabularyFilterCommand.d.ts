import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CreateVocabularyFilterRequest,
  CreateVocabularyFilterResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface CreateVocabularyFilterCommandInput
  extends CreateVocabularyFilterRequest {}
export interface CreateVocabularyFilterCommandOutput
  extends CreateVocabularyFilterResponse,
    __MetadataBearer {}
declare const CreateVocabularyFilterCommand_base: {
  new (
    input: CreateVocabularyFilterCommandInput
  ): import("@smithy/core/client").CommandImpl<
    CreateVocabularyFilterCommandInput,
    CreateVocabularyFilterCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CreateVocabularyFilterCommandInput
  ): import("@smithy/core/client").CommandImpl<
    CreateVocabularyFilterCommandInput,
    CreateVocabularyFilterCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class CreateVocabularyFilterCommand extends CreateVocabularyFilterCommand_base {
  protected static __types: {
    api: {
      input: CreateVocabularyFilterRequest;
      output: CreateVocabularyFilterResponse;
    };
    sdk: {
      input: CreateVocabularyFilterCommandInput;
      output: CreateVocabularyFilterCommandOutput;
    };
  };
}
