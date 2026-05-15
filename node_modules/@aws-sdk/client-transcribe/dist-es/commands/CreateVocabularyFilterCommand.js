import { Command as $Command } from "@smithy/core/client";
import { getEndpointPlugin } from "@smithy/core/endpoints";
import { commonParams } from "../endpoint/EndpointParameters";
import { CreateVocabularyFilter$ } from "../schemas/schemas_0";
export { $Command };
export class CreateVocabularyFilterCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Transcribe", "CreateVocabularyFilter", {})
    .n("TranscribeClient", "CreateVocabularyFilterCommand")
    .sc(CreateVocabularyFilter$)
    .build() {
}
