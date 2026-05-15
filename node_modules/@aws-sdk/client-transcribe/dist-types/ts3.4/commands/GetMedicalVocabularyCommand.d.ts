import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetMedicalVocabularyRequest,
  GetMedicalVocabularyResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface GetMedicalVocabularyCommandInput
  extends GetMedicalVocabularyRequest {}
export interface GetMedicalVocabularyCommandOutput
  extends GetMedicalVocabularyResponse,
    __MetadataBearer {}
declare const GetMedicalVocabularyCommand_base: {
  new (
    input: GetMedicalVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetMedicalVocabularyCommandInput,
    GetMedicalVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetMedicalVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetMedicalVocabularyCommandInput,
    GetMedicalVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetMedicalVocabularyCommand extends GetMedicalVocabularyCommand_base {
  protected static __types: {
    api: {
      input: GetMedicalVocabularyRequest;
      output: GetMedicalVocabularyResponse;
    };
    sdk: {
      input: GetMedicalVocabularyCommandInput;
      output: GetMedicalVocabularyCommandOutput;
    };
  };
}
