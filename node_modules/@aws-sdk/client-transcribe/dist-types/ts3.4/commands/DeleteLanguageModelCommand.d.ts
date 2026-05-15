import { Command as $Command } from "@smithy/core/client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteLanguageModelRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TranscribeClientResolvedConfig,
} from "../TranscribeClient";
export { __MetadataBearer };
export { $Command };
export interface DeleteLanguageModelCommandInput
  extends DeleteLanguageModelRequest {}
export interface DeleteLanguageModelCommandOutput extends __MetadataBearer {}
declare const DeleteLanguageModelCommand_base: {
  new (
    input: DeleteLanguageModelCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteLanguageModelCommandInput,
    DeleteLanguageModelCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteLanguageModelCommandInput
  ): import("@smithy/core/client").CommandImpl<
    DeleteLanguageModelCommandInput,
    DeleteLanguageModelCommandOutput,
    TranscribeClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): {
    [x: string]: unknown;
  };
};
export declare class DeleteLanguageModelCommand extends DeleteLanguageModelCommand_base {
  protected static __types: {
    api: {
      input: DeleteLanguageModelRequest;
      output: {};
    };
    sdk: {
      input: DeleteLanguageModelCommandInput;
      output: DeleteLanguageModelCommandOutput;
    };
  };
}
