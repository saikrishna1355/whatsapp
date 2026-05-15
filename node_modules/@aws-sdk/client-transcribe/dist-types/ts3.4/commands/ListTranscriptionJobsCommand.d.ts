import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListTranscriptionJobsRequest,
  ListTranscriptionJobsResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface ListTranscriptionJobsCommandInput
  extends ListTranscriptionJobsRequest {}
export interface ListTranscriptionJobsCommandOutput
  extends ListTranscriptionJobsResponse,
    __MetadataBearer {}
declare const ListTranscriptionJobsCommand_base: {
  new (
    input: ListTranscriptionJobsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListTranscriptionJobsCommandInput,
    ListTranscriptionJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListTranscriptionJobsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListTranscriptionJobsCommandInput,
    ListTranscriptionJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListTranscriptionJobsCommand extends ListTranscriptionJobsCommand_base {
  protected static __types: {
    api: {
      input: ListTranscriptionJobsRequest;
      output: ListTranscriptionJobsResponse;
    };
    sdk: {
      input: ListTranscriptionJobsCommandInput;
      output: ListTranscriptionJobsCommandOutput;
    };
  };
}
