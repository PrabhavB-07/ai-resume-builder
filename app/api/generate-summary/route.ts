import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const prompt = `
Create a professional ATS-friendly resume summary.

Skills: ${body.skills}

Experience: ${body.experience}
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

    console.log(data);

    if (data.error) {

      return NextResponse.json({
        summary: data.error.message,
      });
    }

    return NextResponse.json({
      summary:
        data.choices[0].message.content,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      summary: "AI generation failed",
    });
  }
}