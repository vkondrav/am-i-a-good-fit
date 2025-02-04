import OpenAI from "openai";
import { compare_prompt, validity_prompt } from "./prompt";

export default {
  async fetch(request, env, ctx) {

    let job_description = "";
    let resume_content = "";

    try {
      ({ job_description, resume_content } = await request.json());
    } catch (e) {
      return new Response("Invalid request", { status: 400 });
    }

    const MAX_LENGTH = 10_000;

    if (resume_content.length === 0) {
      return new Response("Resume cannot be empty", { status: 400 });
    }

    if (resume_content.length > MAX_LENGTH) {
      return new Response("Resume too long. Please upload a smaller file.", { status: 400 });
    }

    if (job_description.length === 0) {
      return new Response("Job Description cannot be empty", { status: 400 });
    }

    if (job_description.length > MAX_LENGTH) {
      return new Response("Job Description too long.", { status: 400 });
    }

    const messages = [
      {
        role: "system",
        content: validity_prompt,
      },
      {
        role: "user",
        content: `Resume: ${resume_content}`,
      },
      {
        role: "user",
        content: `Job Description: ${job_description}`,
      },
    ];

    const input_validity = JSON.parse((await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', { messages }))['response']);

    console.log(input_validity);

    if (!input_validity.passing) {
      return new Response(input_validity.message, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    let { readable, writable } = new TransformStream();
    let writer = writable.getWriter();
    const textEncoder = new TextEncoder();

    ctx.waitUntil(
      (async () => {
        const stream = await openai.chat.completions.create({
          model: "o3-mini",
          messages: [
            {
              role: 'system',
              content: compare_prompt
            },
            {
              role: 'user',
              content: `Job Description: ${job_description}`
            },
            {
              role: 'user',
              content: `Resume: ${resume_content}`
            }
          ],
          stream: true,
        });

        for await (const part of stream) {
          writer.write(
            textEncoder.encode(part.choices[0]?.delta?.content || ""),
          );
        }
        writer.close();
      })(),
    );

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  },
};