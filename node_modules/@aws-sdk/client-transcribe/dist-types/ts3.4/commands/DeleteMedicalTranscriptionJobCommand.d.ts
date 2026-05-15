import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteMedicalTranscriptionJobRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteMedicalTranscriptionJobCommandInput
  extends DeleteMedicalTranscriptionJobRequest {}
export interface DeleteMedicalTranscriptionJobCommandOutput
  extends __MetadataBearer {}
declare const DeleteMedicalTranscriptionJobCommand_base: {
  new (
    input: DeleteMedicalTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteMedicalTranscriptionJobCommandInput,
    DeleteMedicalTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteMedicalTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteMedicalTranscriptionJobCommandInput,
    DeleteMedicalTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteMedicalTranscriptionJobCommand extends DeleteMedicalTranscriptionJobCommand_base {
  protected static __types: {
    api: {
      input: DeleteMedicalTranscriptionJobRequest;
      output: {};
    };
    sdk: {
      input: DeleteMedicalTranscriptionJobCommandInput;
      output: DeleteMedicalTranscriptionJobCommandOutput;
    };
  };
}
