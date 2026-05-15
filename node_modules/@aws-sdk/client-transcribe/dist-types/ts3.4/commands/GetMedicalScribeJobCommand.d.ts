import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetMedicalScribeJobRequest,
  GetMedicalScribeJobResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface GetMedicalScribeJobCommandInput
  extends GetMedicalScribeJobRequest {}
export interface GetMedicalScribeJobCommandOutput
  extends GetMedicalScribeJobResponse,
    __MetadataBearer {}
declare const GetMedicalScribeJobCommand_base: {
  new (
    input: GetMedicalScribeJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetMedicalScribeJobCommandInput,
    GetMedicalScribeJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetMedicalScribeJobCommandInput
  ): import("@smithy/core/client").CommandImpl<
    GetMedicalScribeJobCommandInput,
    GetMedicalScribeJobCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class GetMedicalScribeJobCommand extends GetMedicalScribeJobCommand_base {
  protected static __types: {
    api: {
      input: GetMedicalScribeJobRequest;
      output: GetMedicalScribeJobResponse;
    };
    sdk: {
      input: GetMedicalScribeJobCommandInput;
      output: GetMedicalScribeJobCommandOutput;
    };
  };
}
