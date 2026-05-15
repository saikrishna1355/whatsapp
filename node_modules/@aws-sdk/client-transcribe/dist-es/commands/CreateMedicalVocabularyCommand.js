import { Command as $Command } from "@smithy/core/client";
import { getEndpointPlugin } from "@smithy/core/endpoints";
import { commonParams } from "../endpoint/EndpointParameters";
import { CreateMedicalVocabulary$ } from "../schemas/schemas_0";
export { $Command };
export class CreateMedicalVocabularyCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Transcribe", "CreateMedicalVocabulary", {})
    .n("TranscribeClient", "CreateMedicalVocabularyCommand")
    .sc(CreateMedicalVocabulary$)
    .build() {
}
