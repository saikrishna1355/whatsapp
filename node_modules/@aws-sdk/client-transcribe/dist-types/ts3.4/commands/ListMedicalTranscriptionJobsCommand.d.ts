import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListMedicalTranscriptionJobsRequest,
  ListMedicalTranscriptionJobsResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface ListMedicalTranscriptionJobsCommandInput
  extends ListMedicalTranscriptionJobsRequest {}
export interface ListMedicalTranscriptionJobsCommandOutput
  extends ListMedicalTranscriptionJobsResponse,
    __MetadataBearer {}
declare const ListMedicalTranscriptionJobsCommand_base: {
  new (
    input: ListMedicalTranscriptionJobsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListMedicalTranscriptionJobsCommandInput,
    ListMedicalTranscriptionJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListMedicalTranscriptionJobsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListMedicalTranscriptionJobsCommandInput,
    ListMedicalTranscriptionJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListMedicalTranscriptionJobsCommand extends ListMedicalTranscriptionJobsCommand_base {
  protected static __types: {
    api: {
      input: ListMedicalTranscriptionJobsRequest;
      output: ListMedicalTranscriptionJobsResponse;
    };
    sdk: {
      input: ListMedicalTranscriptionJobsCommandInput;
      output: ListMedicalTranscriptionJobsCommandOutput;
    };
  };
}
