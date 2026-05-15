import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateVocabularyRequest,
  UpdateVocabularyResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface UpdateVocabularyCommandInput extends UpdateVocabularyRequest {}
export interface UpdateVocabularyCommandOutput
  extends UpdateVocabularyResponse,
    __MetadataBearer {}
declare const UpdateVocabularyCommand_base: {
  new (
    input: UpdateVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateVocabularyCommandInput,
    UpdateVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateVocabularyCommandInput,
    UpdateVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class UpdateVocabularyCommand extends UpdateVocabularyCommand_base {
  protected static __types: {
    api: {
      input: UpdateVocabularyRequest;
      output: UpdateVocabularyResponse;
    };
    sdk: {
      input: UpdateVocabularyCommandInput;
      output: UpdateVocabularyCommandOutput;
    };
  };
}
