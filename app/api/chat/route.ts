import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

type ChatMessage = {
  role: "assistant" | "user"
  content: string
}

type Provider = "gemini" | "openai"

const provider = (process.env.LLM_PROVIDER ?? (process.env.GEMINI_API_KEY ? "gemini" : "openai")) as Provider
const systemPrompt = `
Voce e o assistente do portfolio de Thiago Lopes.
Responda em portugues do Brasil, a menos que o usuario escreva em outro idioma.
Baseie-se principalmente no contexto abaixo para falar sobre Thiago.
Nao invente experiencias, empresas, numeros ou fatos que nao estejam no contexto.
Quando a pergunta fugir do contexto, deixe claro a limitacao e convide a pessoa a entrar em contato direto com Thiago.
Mantenha respostas objetivas, acolhedoras e uteis para visitantes do portfolio.
`.trim()

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

  if (!apiKey) {
    return {
      error:
        "Configure GEMINI_API_KEY para usar modelos Gemini. Opcionalmente, defina GEMINI_MODEL e GEMINI_BASE_URL.",
      status: 500,
    }
  }

  const response = await fetch(`${baseUrl}/models/${model}:generateContent?key=${apiKey}`, {
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
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: data?.error?.message ?? "O Gemini nao conseguiu responder agora. Tente novamente em instantes.",
      status: response.status,
    }
  }

  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim()

  if (!reply) {
    const blockReason = data?.promptFeedback?.blockReason

    return {
      error: blockReason
        ? `O Gemini bloqueou esta resposta (${blockReason}). Tente reformular a pergunta.`
        : "A resposta do Gemini veio vazia. Tente novamente.",
      status: 502,
    }
  }

  return { reply }
}

export async function POST(request: Request) {
  try {
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

    const result =
      provider === "gemini"
        ? await callGemini(recentHistory, prompt)
        : await callOpenAI(recentHistory, prompt)

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
