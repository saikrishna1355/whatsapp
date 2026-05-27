"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bedrockProvider = void 0;
const config_1 = require("../../../config");
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const client_s3_1 = require("@aws-sdk/client-s3");
const client_transcribe_1 = require("@aws-sdk/client-transcribe");
const bedrockClient = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: config_1.config.ai.bedrock.region });
const s3Client = new client_s3_1.S3Client({ region: config_1.config.ai.transcribe.region });
const transcribeClient = new client_transcribe_1.TranscribeClient({ region: config_1.config.ai.transcribe.region });
function extractEntriesFromText(raw) {
    const match = raw.match(/\[[\s\S]*\]/);
    const jsonText = match ? match[0] : raw;
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed))
        return [];
    return parsed
        .map((item) => ({
        description: String(item?.description ?? '').trim(),
        amount: Number(item?.amount),
    }))
        .filter((item) => item.description.length > 0 && Number.isFinite(item.amount) && item.amount > 0);
}
async function askBedrockForEntries(parts, module) {
    const instruction = [
        `You extract ${module} entries from user content.`,
        'Return STRICT JSON only: [{"description":"...","amount":123.45}]',
        'Use number for amount.',
        'No markdown, no extra text.',
        'If nothing valid is found return [] only.',
    ].join(' ');
    const result = await bedrockClient.send(new client_bedrock_runtime_1.ConverseCommand({
        modelId: config_1.config.ai.bedrock.model,
        system: [{ text: instruction }],
        messages: [{ role: 'user', content: parts }],
        inferenceConfig: { maxTokens: config_1.config.ai.bedrock.maxTokens, temperature: 0 },
    }));
    const responseText = result.output?.message?.content
        ?.map((block) => block.text ?? '')
        .join('\n')
        .trim();
    if (!responseText)
        return [];
    return extractEntriesFromText(responseText);
}
function imageFormatFromMime(mimeType) {
    if (mimeType.includes('png'))
        return 'png';
    if (mimeType.includes('gif'))
        return 'gif';
    if (mimeType.includes('webp'))
        return 'webp';
    return 'jpeg';
}
exports.bedrockProvider = {
    async extractEntries(text, module) {
        return askBedrockForEntries([{ text }], module);
    },
    async analyzeImage(buffer, mimeType, module) {
        const format = imageFormatFromMime(mimeType);
        return askBedrockForEntries([{
                image: {
                    format,
                    source: { bytes: new Uint8Array(buffer) },
                },
            }, {
                text: 'Read this image (bill/receipt/note) and extract financial entries.',
            }], module);
    },
    async transcribeAudio(buffer, mimeType) {
        const { bucket, languageCode, pollMs, timeoutMs } = config_1.config.ai.transcribe;
        if (!bucket) {
            throw new Error('AWS_TRANSCRIBE_BUCKET is required for transcription');
        }
        const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mpeg') ? 'mp3' : 'mp4';
        const key = `transcribe-input/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const mediaFormat = ext === 'mp4' ? 'mp4' : ext === 'ogg' ? 'ogg' : 'mp3';
        const jobName = `wau-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        await s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        }));
        await transcribeClient.send(new client_transcribe_1.StartTranscriptionJobCommand({
            TranscriptionJobName: jobName,
            LanguageCode: languageCode,
            MediaFormat: mediaFormat,
            Media: {
                MediaFileUri: `s3://${bucket}/${key}`,
            },
        }));
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const statusRes = await transcribeClient.send(new client_transcribe_1.GetTranscriptionJobCommand({
                TranscriptionJobName: jobName,
            }));
            const status = statusRes.TranscriptionJob?.TranscriptionJobStatus;
            if (status === 'COMPLETED') {
                const uri = statusRes.TranscriptionJob?.Transcript?.TranscriptFileUri;
                if (!uri)
                    break;
                const transcriptRes = await fetch(uri);
                const transcriptJson = await transcriptRes.json();
                const text = transcriptJson?.results?.transcripts?.[0]?.transcript ?? '';
                await transcribeClient.send(new client_transcribe_1.DeleteTranscriptionJobCommand({ TranscriptionJobName: jobName }));
                return text;
            }
            if (status === 'FAILED') {
                const reason = statusRes.TranscriptionJob?.FailureReason ?? 'Unknown reason';
                await transcribeClient.send(new client_transcribe_1.DeleteTranscriptionJobCommand({ TranscriptionJobName: jobName }));
                throw new Error(`Transcribe failed: ${reason}`);
            }
            await new Promise((resolve) => setTimeout(resolve, pollMs));
        }
        await transcribeClient.send(new client_transcribe_1.DeleteTranscriptionJobCommand({ TranscriptionJobName: jobName }));
        throw new Error('Transcribe timeout exceeded');
    },
};
//# sourceMappingURL=bedrock.provider.js.map