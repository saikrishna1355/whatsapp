import { Command as $Command } from "@smithy/core/client";
import { getEndpointPlugin } from "@smithy/core/endpoints";
import { commonParams } from "../endpoint/EndpointParameters";
import { ListMedicalTranscriptionJobs$ } from "../schemas/schemas_0";
export { $Command };
export class ListMedicalTranscriptionJobsCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Transcribe", "ListMedicalTranscriptionJobs", {})
    .n("TranscribeClient", "ListMedicalTranscriptionJobsCommand")
    .sc(ListMedicalTranscriptionJobs$)
    .build() {
}
