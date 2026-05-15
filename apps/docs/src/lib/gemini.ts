import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

interface GeminiInlineData {
  data?: string;
  mimeType?: string;
}

interface GeminiPart {
  inlineData?: GeminiInlineData;
}

interface GeminiCandidate {
  finishReason?: string;
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
}

interface GeminiGenerateContentRequest {
  model: string;
  contents: string;
  config: {
    responseModalities: ['AUDIO'];
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: string;
        };
      };
    };
    systemInstruction?: string;
  };
}

function buildTtsContents(text: string, style: string): string {
  if (!style) {
    return text;
  }

  return `Speaking style instructions:\n${style}\n\nText to speak:\n${text}`;
}

function isUnsupportedSystemInstructionError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes('Developer instruction is not enabled for this model')
  );
}

function pcmToWav(
  pcmData: Buffer,
  sampleRate: number,
  numChannels: number,
  bitsPerSample: number,
): Buffer {
  const wavHeader = Buffer.alloc(44);
  const chunkSize = pcmData.length;
  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + chunkSize, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  wavHeader.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(chunkSize, 40);
  return Buffer.concat([wavHeader, pcmData]);
}

function findAudioPart(response: GeminiGenerateContentResponse): GeminiPart | undefined {
  const candidates = response.candidates ?? [];

  for (const candidate of candidates) {
    const parts = candidate.content?.parts ?? [];
    const audioPart = parts.find((part) => part.inlineData?.data);
    if (audioPart) {
      return audioPart;
    }
  }

  return undefined;
}

export async function generateGeminiTTS(
  text: string,
  speaker: string,
  style: string,
  model: string,
): Promise<Buffer> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined');
  }

  // Handle default string mapping from plugin or other fallbacks
  let voiceName = speaker;
  if (!voiceName || voiceName === 'gemini-flash') {
    voiceName = 'Aoede';
  }

  const requestPayload: GeminiGenerateContentRequest = {
    model,
    contents: text,
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName,
          },
        },
      },
    },
  };

  if (style) {
    requestPayload.config.systemInstruction = style;
  }

  try {
    let response: GeminiGenerateContentResponse;

    try {
      response = (await ai.models.generateContent(requestPayload)) as GeminiGenerateContentResponse;
    } catch (error) {
      if (!isUnsupportedSystemInstructionError(error)) {
        throw error;
      }

      const fallbackPayload: GeminiGenerateContentRequest = {
        model,
        contents: buildTtsContents(text, style),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName,
              },
            },
          },
        },
      };

      response = (await ai.models.generateContent(fallbackPayload)) as GeminiGenerateContentResponse;
    }

    const finishReason = response.candidates?.[0]?.finishReason;
    const part = findAudioPart(response);
    if (!part?.inlineData?.data) {
      throw new Error(`Gemini did not return audio data. finishReason: ${finishReason ?? 'unknown'}`);
    }

    const mimeType = part.inlineData.mimeType || ''; // audio/L16;codec=pcm;rate=24000
    const audioData = part.inlineData.data;
    const pcmBuffer = Buffer.from(audioData, 'base64');

    // Parse sample rate if possible, default to 24000
    let sampleRate = 24000;
    if (mimeType.includes('rate=')) {
      sampleRate = parseInt(mimeType.split('rate=')[1], 10) || 24000;
    }

    // Convert raw L16 PCM to standard WAV format
    return pcmToWav(pcmBuffer, sampleRate, 1, 16);
  } catch (error) {
    console.error('Error generating TTS with Gemini:', error);
    throw error;
  }
}
