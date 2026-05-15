import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteVocabularyRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteVocabularyCommandInput extends DeleteVocabularyRequest {}
export interface DeleteVocabularyCommandOutput extends __MetadataBearer {}
declare const DeleteVocabularyCommand_base: {
  new (
    input: DeleteVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteVocabularyCommandInput,
    DeleteVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteVocabularyCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteVocabularyCommandInput,
    DeleteVocabularyCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteVocabularyCommand extends DeleteVocabularyCommand_base {
  protected static __types: {
    api: {
      input: DeleteVocabularyRequest;
      output: {};
    };
    sdk: {
      input: DeleteVocabularyCommandInput;
      output: DeleteVocabularyCommandOutput;
    };
  };
}
