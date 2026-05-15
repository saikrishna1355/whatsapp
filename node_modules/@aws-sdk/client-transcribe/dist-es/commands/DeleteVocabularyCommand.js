import { Command as $Command } from "@smithy/core/client";
import { getEndpointPlugin } from "@smithy/core/endpoints";
import { commonParams } from "../endpoint/EndpointParameters";
import { DeleteVocabulary$ } from "../schemas/schemas_0";
export { $Command };
export class DeleteVocabularyCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Transcribe", "DeleteVocabulary", {})
    .n("TranscribeClient", "DeleteVocabularyCommand")
    .sc(DeleteVocabulary$)
    .build() {
}
