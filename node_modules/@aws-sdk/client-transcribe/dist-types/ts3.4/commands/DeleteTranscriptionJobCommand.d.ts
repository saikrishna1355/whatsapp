import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteTranscriptionJobRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteTranscriptionJobCommandInput
  extends DeleteTranscriptionJobRequest {}
export interface DeleteTranscriptionJobCommandOutput extends __MetadataBearer {}
declare const DeleteTranscriptionJobCommand_base: {
  new (
    input: DeleteTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteTranscriptionJobCommandInput,
    DeleteTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteTranscriptionJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteTranscriptionJobCommandInput,
    DeleteTranscriptionJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteTranscriptionJobCommand extends DeleteTranscriptionJobCommand_base {
  protected static __types: {
    api: {
      input: DeleteTranscriptionJobRequest;
      output: {};
    };
    sdk: {
      input: DeleteTranscriptionJobCommandInput;
      output: DeleteTranscriptionJobCommandOutput;
    };
  };
}
