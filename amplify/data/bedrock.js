export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;
  
    // Return the request configuration
    return {
      resourcePath: `/model/us.anthropic.claude-haiku-4-5-20251001-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    const parsedBody = JSON.parse(ctx.result.body);

    if (parsedBody.content?.[0]?.text) {
      return {
        body: parsedBody.content[0].text,
        error: null,
      };
    }

    return {
      body: null,
      error: `${ctx.result.statusCode || "Unknown status"}: ${parsedBody.message || parsedBody.error?.message || parsedBody.error || "Bedrock returned no text content."} | ${ctx.result.body?.substring?.(0, 500) || ""}`,
    };
  }