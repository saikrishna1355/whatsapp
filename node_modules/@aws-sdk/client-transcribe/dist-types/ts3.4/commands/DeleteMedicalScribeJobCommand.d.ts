import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteMedicalScribeJobRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteMedicalScribeJobCommandInput
  extends DeleteMedicalScribeJobRequest {}
export interface DeleteMedicalScribeJobCommandOutput extends __MetadataBearer {}
declare const DeleteMedicalScribeJobCommand_base: {
  new (
    input: DeleteMedicalScribeJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteMedicalScribeJobCommandInput,
    DeleteMedicalScribeJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteMedicalScribeJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteMedicalScribeJobCommandInput,
    DeleteMedicalScribeJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteMedicalScribeJobCommand extends DeleteMedicalScribeJobCommand_base {
  protected static __types: {
    api: {
      input: DeleteMedicalScribeJobRequest;
      output: {};
    };
    sdk: {
      input: DeleteMedicalScribeJobCommandInput;
      output: DeleteMedicalScribeJobCommandOutput;
    };
  };
}
