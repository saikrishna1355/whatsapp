import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateMedicalVocabularyRequest,
  UpdateMedicalVocabularyResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface UpdateMedicalVocabularyCommandInput
  extends UpdateMedicalVocabularyRequest {}
export interface UpdateMedicalVocabularyCommandOutput
  extends UpdateMedicalVocabularyResponse,
    __MetadataBearer {}
declare const UpdateMedicalVocabularyCommand_base: {
  new (
    input: UpdateMedicalVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateMedicalVocabularyCommandInput,
    UpdateMedicalVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateMedicalVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    UpdateMedicalVocabularyCommandInput,
    UpdateMedicalVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class UpdateMedicalVocabularyCommand extends UpdateMedicalVocabularyCommand_base {
  protected static __types: {
    api: {
      input: UpdateMedicalVocabularyRequest;
      output: UpdateMedicalVocabularyResponse;
    };
    sdk: {
      input: UpdateMedicalVocabularyCommandInput;
      output: UpdateMedicalVocabularyCommandOutput;
    };
  };
}
