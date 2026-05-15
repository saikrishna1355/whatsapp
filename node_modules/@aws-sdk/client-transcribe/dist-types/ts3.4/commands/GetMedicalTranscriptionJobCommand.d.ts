import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetMedicalTranscriptionJobRequest,
  GetMedicalTranscriptionJobResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface GetMedicalTranscriptionJobCommandInput
  extends GetMedicalTranscriptionJobRequest {}
export interface GetMedicalTranscriptionJobCommandOutput
  extends GetMedicalTranscriptionJobResponse,
    __MetadataBearer {}
declare const GetMedicalTranscriptionJobCommand_base: {
  new (
    input: GetMedicalTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetMedicalTranscriptionJobCommandInput,
    GetMedicalTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetMedicalTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetMedicalTranscriptionJobCommandInput,
    GetMedicalTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetMedicalTranscriptionJobCommand extends GetMedicalTranscriptionJobCommand_base {
  protected static __types: {
    api: {
      input: GetMedicalTranscriptionJobRequest;
      output: GetMedicalTranscriptionJobResponse;
    };
    sdk: {
      input: GetMedicalTranscriptionJobCommandInput;
      output: GetMedicalTranscriptionJobCommandOutput;
    };
  };
}
