import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { ttsCache, licenses } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { generateGeminiTTS } from '@/lib/gemini';

const CDN_AUDIO_BASE_URL = 'https://cdn.cursorjs.com/voices';

interface TTSRequestBody {
  prompt?: unknown;
  text?: unknown;
  speaker?: unknown;
  style?: unknown;
  language?: unknown;
  model?: unknown;
  licenseKey?: unknown;
}

interface TTSHashPayload {
  prompt: string;
  text: string;
  speaker: string;
  language: string;
  style: string;
  model: string;
}

function generateHash(payload: TTSHashPayload): string {
  return crypto.createHash('sha1').update(JSON.stringify(payload)).digest('hex');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TTSRequestBody;
    const { text, speaker, style, language, model, licenseKey } = body;

    if (
      !isNonEmptyString(text) ||
      !isNonEmptyString(speaker) ||
      !isNonEmptyString(style) ||
      !isNonEmptyString(language) ||
      !isNonEmptyString(model)
    ) {
      return NextResponse.json(
        { error: 'text, speaker, style, language and model are required properties' },
        { status: 400 },
      );
    }

    let isAuthorized = false;
    const licenseKeyValue = isNonEmptyString(licenseKey) ? licenseKey : undefined;

    if (licenseKeyValue) {
      const [license] = await db
        .select()
        .from(licenses)
        .where(eq(licenses.key, licenseKeyValue))
        .limit(1);

      if (!license) {
        return NextResponse.json({ error: 'Invalid license key' }, { status: 401 });
      }

      if (license.status !== 'active') {
        return NextResponse.json({ error: 'Your license is not active' }, { status: 403 });
      }

      if (license.credits <= 0) {
        return NextResponse.json({ error: 'Your TTS credit limit has been reached' }, { status: 402 });
      }

      isAuthorized = true;
    } else {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'License key is required' }, { status: 401 });
    }

    const prompt = isNonEmptyString(body.prompt) ? body.prompt : style;
    const hashPayload: TTSHashPayload = {
      prompt,
      text,
      speaker,
      language,
      style,
      model,
    };
    const hash = generateHash(hashPayload);
    const audioPath = `tts/${hash}.wav`;
    const audioUrl = `${CDN_AUDIO_BASE_URL}/${hash}.wav`;

    console.log(`[TTS] Generating audio for ${hash}: ${text.substring(0, 30)}...`);
    const audioBuffer = await generateGeminiTTS(text, speaker, prompt, model);

    await put(audioPath, audioBuffer, {
      access: 'public',
      contentType: 'audio/wav',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const [cachedEntry] = await db.select().from(ttsCache).where(eq(ttsCache.hash, hash)).limit(1);
    const cacheValues = {
      hash,
      prompt,
      text,
      speaker,
      style,
      model,
      language,
      audioUrl,
    };

    if (cachedEntry) {
      await db.update(ttsCache).set(cacheValues).where(eq(ttsCache.hash, hash));
    } else {
      await db.insert(ttsCache).values(cacheValues);
    }

    if (licenseKeyValue) {
      await db
        .update(licenses)
        .set({ credits: sql`${licenses.credits} - 1` })
        .where(eq(licenses.key, licenseKeyValue));
    }

    return NextResponse.json({
      url: audioUrl,
      hash,
      cached: false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API /tts error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}
