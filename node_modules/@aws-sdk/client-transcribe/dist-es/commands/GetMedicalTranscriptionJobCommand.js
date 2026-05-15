import { Command as $Command } from "@smithy/core/client";
import { getEndpointPlugin } from "@smithy/core/endpoints";
import { commonParams } from "../endpoint/EndpointParameters";
import { GetMedicalTranscriptionJob$ } from "../schemas/schemas_0";
export { $Command };
export class GetMedicalTranscriptionJobCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Transcribe", "GetMedicalTranscriptionJob", {})
    .n("TranscribeClient", "GetMedicalTranscriptionJobCommand")
    .sc(GetMedicalTranscriptionJob$)
    .build() {
}
