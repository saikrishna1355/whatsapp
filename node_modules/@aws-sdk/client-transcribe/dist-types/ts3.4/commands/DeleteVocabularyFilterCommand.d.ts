import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteVocabularyFilterRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteVocabularyFilterCommandInput
  extends DeleteVocabularyFilterRequest {}
export interface DeleteVocabularyFilterCommandOutput extends __MetadataBearer {}
declare const DeleteVocabularyFilterCommand_base: {
  new (
    input: DeleteVocabularyFilterCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteVocabularyFilterCommandInput,
    DeleteVocabularyFilterCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteVocabularyFilterCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteVocabularyFilterCommandInput,
    DeleteVocabularyFilterCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteVocabularyFilterCommand extends DeleteVocabularyFilterCommand_base {
  protected static __types: {
    api: {
      input: DeleteVocabularyFilterRequest;
      output: {};
    };
    sdk: {
      input: DeleteVocabularyFilterCommandInput;
      output: DeleteVocabularyFilterCommandOutput;
    };
  };
}
