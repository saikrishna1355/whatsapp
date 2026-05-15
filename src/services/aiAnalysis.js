function getProvider() {
  return String(process.env.AI_PROVIDER || "openai").toLowerCase();
}

async function analyzeCapturedMedia(capture) {
  const provider = getProvider();

  if (provider === "openai") {
    return require("./openaiAnalysis").analyzeCapturedMedia(capture);
  }

  if (provider === "bedrock" || provider === "aws") {
    return require("./bedrockAnalysis").analyzeCapturedMedia(capture);
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}

module.exports = { analyzeCapturedMedia };
