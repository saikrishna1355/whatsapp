import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  StartMedicalTranscriptionJobRequest,
  StartMedicalTranscriptionJobResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface StartMedicalTranscriptionJobCommandInput
  extends StartMedicalTranscriptionJobRequest {}
export interface StartMedicalTranscriptionJobCommandOutput
  extends StartMedicalTranscriptionJobResponse,
    __MetadataBearer {}
declare const StartMedicalTranscriptionJobCommand_base: {
  new (
    input: StartMedicalTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    StartMedicalTranscriptionJobCommandInput,
    StartMedicalTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: StartMedicalTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    StartMedicalTranscriptionJobCommandInput,
    StartMedicalTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class StartMedicalTranscriptionJobCommand extends StartMedicalTranscriptionJobCommand_base {
  protected static __types: {
    api: {
      input: StartMedicalTranscriptionJobRequest;
      output: StartMedicalTranscriptionJobResponse;
    };
    sdk: {
      input: StartMedicalTranscriptionJobCommandInput;
      output: StartMedicalTranscriptionJobCommandOutput;
    };
  };
}
