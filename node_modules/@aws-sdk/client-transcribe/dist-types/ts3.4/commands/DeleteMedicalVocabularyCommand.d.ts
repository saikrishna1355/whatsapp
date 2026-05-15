import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteMedicalVocabularyRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteMedicalVocabularyCommandInput
  extends DeleteMedicalVocabularyRequest {}
export interface DeleteMedicalVocabularyCommandOutput
  extends __MetadataBearer {}
declare const DeleteMedicalVocabularyCommand_base: {
  new (
    input: DeleteMedicalVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteMedicalVocabularyCommandInput,
    DeleteMedicalVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteMedicalVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteMedicalVocabularyCommandInput,
    DeleteMedicalVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteMedicalVocabularyCommand extends DeleteMedicalVocabularyCommand_base {
  protected static __types: {
    api: {
      input: DeleteMedicalVocabularyRequest;
      output: {};
    };
    sdk: {
      input: DeleteMedicalVocabularyCommandInput;
      output: DeleteMedicalVocabularyCommandOutput;
    };
  };
}
