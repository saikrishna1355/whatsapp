import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateVocabularyFilterRequest,
  UpdateVocabularyFilterResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface UpdateVocabularyFilterCommandInput
  extends UpdateVocabularyFilterRequest {}
export interface UpdateVocabularyFilterCommandOutput
  extends UpdateVocabularyFilterResponse,
    __MetadataBearer {}
declare const UpdateVocabularyFilterCommand_base: {
  new (
    input: UpdateVocabularyFilterCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateVocabularyFilterCommandInput,
    UpdateVocabularyFilterCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateVocabularyFilterCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateVocabularyFilterCommandInput,
    UpdateVocabularyFilterCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class UpdateVocabularyFilterCommand extends UpdateVocabularyFilterCommand_base {
  protected static __types: {
    api: {
      input: UpdateVocabularyFilterRequest;
      output: UpdateVocabularyFilterResponse;
    };
    sdk: {
      input: UpdateVocabularyFilterCommandInput;
      output: UpdateVocabularyFilterCommandOutput;
    };
  };
}
