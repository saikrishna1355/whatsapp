import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListMedicalScribeJobsRequest,
  ListMedicalScribeJobsResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface ListMedicalScribeJobsCommandInput
  extends ListMedicalScribeJobsRequest {}
export interface ListMedicalScribeJobsCommandOutput
  extends ListMedicalScribeJobsResponse,
    __MetadataBearer {}
declare const ListMedicalScribeJobsCommand_base: {
  new (
    input: ListMedicalScribeJobsCommandInput
  ): import("@smithy/core/client").CommandImpl<
    ListMedicalScribeJobsCommandInput,
    ListMedicalScribeJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListMedicalScribeJobsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListMedicalScribeJobsCommandInput,
    ListMedicalScribeJobsCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class ListMedicalScribeJobsCommand extends ListMedicalScribeJobsCommand_base {
  protected static __types: {
    api: {
      input: ListMedicalScribeJobsRequest;
      output: ListMedicalScribeJobsResponse;
    };
    sdk: {
      input: ListMedicalScribeJobsCommandInput;
      output: ListMedicalScribeJobsCommandOutput;
    };
  };
}
