import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetTranscriptionJobRequest,
  GetTranscriptionJobResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface GetTranscriptionJobCommandInput
  extends GetTranscriptionJobRequest {}
export interface GetTranscriptionJobCommandOutput
  extends GetTranscriptionJobResponse,
    __MetadataBearer {}
declare const GetTranscriptionJobCommand_base: {
  new (
    input: GetTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetTranscriptionJobCommandInput,
    GetTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetTranscriptionJobCommandInput,
    GetTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetTranscriptionJobCommand extends GetTranscriptionJobCommand_base {
  protected static __types: {
    api: {
      input: GetTranscriptionJobRequest;
      output: GetTranscriptionJobResponse;
    };
    sdk: {
      input: GetTranscriptionJobCommandInput;
      output: GetTranscriptionJobCommandOutput;
    };
  };
}
