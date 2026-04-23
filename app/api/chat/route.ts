import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

type ChatMessage = {
  role: "assistant" | "user"
  content: string
}

type Provider = "gemini" | "openai"

const provider = (process.env.LLM_PROVIDER ?? (process.env.GEMINI_API_KEY ? "gemini" : "openai")) as Provider
const geminiRequestSpacingMs = Number(process.env.GEMINI_REQUEST_SPACING_MS ?? 400)
const geminiTimeoutMs = Number(process.env.GEMINI_TIMEOUT_MS ?? 20000)
const geminiMaxRetries = Number(process.env.GEMINI_MAX_RETRIES ?? 5)
const geminiMaxConcurrency = Math.max(1, Number(process.env.GEMINI_MAX_CONCURRENCY ?? 1))
const systemPrompt = `
Voce e o assistente do portfolio de Thiago Lopes.
Responda em portugues do Brasil, a menos que o usuario escreva em outro idioma.
Baseie-se principalmente no contexto abaixo para falar sobre Thiago.
Nao invente experiencias, empresas, numeros ou fatos que nao estejam no contexto.
Quando a pergunta fugir do contexto, deixe claro a limitacao e convide a pessoa a entrar em contato direto com Thiago.
Mantenha respostas objetivas, acolhedoras e uteis para visitantes do portfolio.
`.trim()

let activeGeminiRequests = 0
const geminiQueue: Array<() => void> = []
let nextGeminiSlotAt = 0

async function getProfileContext() {
  const filePath = path.join(process.cwd(), "content", "thiago-profile.txt")
  return readFile(filePath, "utf-8")
}

function buildSystemPrompt(profileContext: string) {
  return `${systemPrompt}\n\nContexto sobre Thiago:\n${profileContext}`
}

async function callOpenAI(messages: ChatMessage[], prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY
  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"

  if (!apiKey) {
    return {
      error:
        "Configure OPENAI_API_KEY para usar modelos OpenAI. Opcionalmente, defina OPENAI_MODEL e OPENAI_BASE_URL.",
      status: 500,
    }
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: prompt,
        },
        ...messages,
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: data?.error?.message ?? "A LLM nao conseguiu responder agora. Tente novamente em instantes.",
      status: response.status,
    }
  }

  const reply = data?.choices?.[0]?.message?.content

  if (!reply) {
    return {
      error: "A resposta da LLM veio vazia. Tente novamente.",
      status: 502,
    }
  }

  return { reply }
}

async function callGemini(messages: ChatMessage[], prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY
  const baseUrl = process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta"
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL

  if (!apiKey) {
    return {
      error:
        "Configure GEMINI_API_KEY para usar modelos Gemini. Opcionalmente, defina GEMINI_MODEL e GEMINI_BASE_URL.",
      status: 500,
    }
  }

  const candidateModels = [model, fallbackModel].filter((item, index, list): item is string => {
    return Boolean(item) && list.indexOf(item) === index
  })

  for (const candidateModel of candidateModels) {
    const response = await fetchGeminiWithRetry(
      `${baseUrl}/models/${candidateModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: prompt }],
          },
          contents: messages.map((item) => ({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.content }],
          })),
          generationConfig: {
            temperature: 0.7,
          },
        }),
      },
    )

    const data = await parseJsonSafely(response)

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ?? "O Gemini nao conseguiu responder agora. Tente novamente em instantes."

      if (candidateModel !== candidateModels[candidateModels.length - 1] && shouldTryAnotherGeminiModel(response, data)) {
        continue
      }

      return {
        error: errorMessage,
        status: response.status,
      }
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim()

    if (reply) {
      return { reply }
    }

    const blockReason = data?.promptFeedback?.blockReason

    return {
      error: blockReason
        ? `O Gemini bloqueou esta resposta (${blockReason}). Tente reformular a pergunta.`
        : "A resposta do Gemini veio vazia. Tente novamente.",
      status: 502,
    }
  }

  return {
    error: "O Gemini nao conseguiu responder agora. Tente novamente em instantes.",
    status: 503,
  }
}

export async function POST(request: Request) {
  try {
    const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY)
    const { message, history } = (await request.json()) as {
      history?: ChatMessage[]
      message?: string
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: "Envie uma mensagem para iniciar a conversa." }, { status: 400 })
    }

    const profileContext = await getProfileContext()
    const recentHistory: ChatMessage[] =
      Array.isArray(history) && history.length > 0
        ? history.slice(-8)
        : [{ role: "user", content: message.trim() }]
    const prompt = buildSystemPrompt(profileContext)

    let result

    if (provider === "gemini") {
      result = await callGemini(recentHistory, prompt)

      if (
        hasOpenAIKey &&
        "error" in result &&
        typeof result.status === "number" &&
        [429, 500, 503].includes(result.status)
      ) {
        result = await callOpenAI(recentHistory, prompt)
      }
    } else {
      result = await callOpenAI(recentHistory, prompt)
    }

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ reply: result.reply })
  } catch {
    return NextResponse.json(
      { error: "Nao foi possivel processar a mensagem agora. Tente novamente em instantes." },
      { status: 500 },
    )
  }
}

async function parseJsonSafely(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function shouldRetryGeminiResponse(response: Response, data: unknown) {
  if ([429, 500, 502, 503, 504].includes(response.status)) {
    return true
  }

  const message =
    typeof data === "object" && data !== null && "error" in data && typeof data.error === "object" && data.error !== null
      ? "message" in data.error && typeof data.error.message === "string"
        ? data.error.message
        : ""
      : ""

  return /high demand|try again later|resource exhausted/i.test(message)
}

function shouldTryAnotherGeminiModel(response: Response, data: unknown) {
  return response.status === 429 || response.status === 503 || shouldRetryGeminiResponse(response, data)
}

function getRetryDelayMs(response: Response, attempt: number) {
  const retryAfter = response.headers.get("retry-after")

  if (retryAfter) {
    const retryAfterSeconds = Number(retryAfter)

    if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
      return retryAfterSeconds * 1000
    }

    const retryAt = Date.parse(retryAfter)

    if (!Number.isNaN(retryAt)) {
      return Math.max(0, retryAt - Date.now())
    }
  }

  const jitter = Math.floor(Math.random() * 300)
  return Math.min(8000, 600 * 2 ** attempt) + jitter
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function scheduleGeminiRequest<T>(task: () => Promise<T>) {
  if (activeGeminiRequests >= geminiMaxConcurrency) {
    await new Promise<void>((resolve) => {
      geminiQueue.push(resolve)
    })
  }

  activeGeminiRequests += 1

  const waitForSpacing = Math.max(0, nextGeminiSlotAt - Date.now())
  nextGeminiSlotAt = Date.now() + geminiRequestSpacingMs

  if (waitForSpacing > 0) {
    await sleep(waitForSpacing)
  }

  try {
    return await task()
  } finally {
    activeGeminiRequests -= 1
    const next = geminiQueue.shift()
    next?.()
  }
}

async function fetchGeminiWithRetry(url: string, options: RequestInit, retries = geminiMaxRetries) {
  let attempt = 0

  while (true) {
    try {
      const response = await scheduleGeminiRequest(async () => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), geminiTimeoutMs)

        try {
          return await fetch(url, {
            ...options,
            signal: controller.signal,
          })
        } finally {
          clearTimeout(timeout)
        }
      })

      if (response.ok) {
        return response
      }

      const data = await parseJsonSafely(response.clone())

      if (attempt >= retries || !shouldRetryGeminiResponse(response, data)) {
        return response
      }

      await sleep(getRetryDelayMs(response, attempt))
      attempt++
    } catch (err) {
      if (attempt >= retries) throw err

      const jitter = Math.floor(Math.random() * 300)
      const delay = Math.min(8000, 600 * 2 ** attempt) + jitter
      await sleep(delay)
      attempt++
    }
  }
}
