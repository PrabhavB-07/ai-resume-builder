import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const prompt = `
Analyze this resume professionally.

Give:
1. ATS Score out of 100
2. Strengths
3. Weaknesses
4. Improvements

Resume Data:

Name: ${body.name}

Skills: ${body.skills}

Summary: ${body.summary}

Experience: ${body.experience}

Projects: ${body.projects}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },

        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      result:
        data.choices[0].message.content,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      result: "Analysis Failed 😭",
    });
  }
}