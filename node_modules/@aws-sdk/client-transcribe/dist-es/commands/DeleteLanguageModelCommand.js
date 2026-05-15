import { Command as $Command } from "@smithy/core/client";
import { getEndpointPlugin } from "@smithy/core/endpoints";
import { commonParams } from "../endpoint/EndpointParameters";
import { DeleteLanguageModel$ } from "../schemas/schemas_0";
export { $Command };
export class DeleteLanguageModelCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Transcribe", "DeleteLanguageModel", {})
    .n("TranscribeClient", "DeleteLanguageModelCommand")
    .sc(DeleteLanguageModel$)
    .build() {
}
