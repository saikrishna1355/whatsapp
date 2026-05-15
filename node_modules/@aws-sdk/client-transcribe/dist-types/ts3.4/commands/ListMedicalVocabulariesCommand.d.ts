import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListMedicalVocabulariesRequest,
  ListMedicalVocabulariesResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface ListMedicalVocabulariesCommandInput
  extends ListMedicalVocabulariesRequest {}
export interface ListMedicalVocabulariesCommandOutput
  extends ListMedicalVocabulariesResponse,
    __MetadataBearer {}
declare const ListMedicalVocabulariesCommand_base: {
  new (
    input: ListMedicalVocabulariesCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListMedicalVocabulariesCommandInput,
    ListMedicalVocabulariesCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListMedicalVocabulariesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListMedicalVocabulariesCommandInput,
    ListMedicalVocabulariesCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListMedicalVocabulariesCommand extends ListMedicalVocabulariesCommand_base {
  protected static __types: {
    api: {
      input: ListMedicalVocabulariesRequest;
      output: ListMedicalVocabulariesResponse;
    };
    sdk: {
      input: ListMedicalVocabulariesCommandInput;
      output: ListMedicalVocabulariesCommandOutput;
    };
  };
}
