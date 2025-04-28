import OpenAI from 'openai';

export const createOpenAIClient = (apiKey: string) => {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Since we're running in the browser
  });
};

export const generateInitialPIDParams = async (
  openai: OpenAI,
  model: string,
  prompt: string,
  images: string[]
) => {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a PID tuning expert. Analyze the user's requirements and any provided images to suggest initial PID parameters. Provide clear explanations for your suggestions that are clearly connected to the equipment the user is tuning. Finish by specifying the Kp, Ki, and Kd values to try."
    },
    {
      role: "user",
      content: [
        {
          type: "text" as const,
          text: prompt
        },
        ...images.map(image => ({
          type: "image_url" as const,
          image_url: {
            url: image,
            detail: "high" as const
          }
        }))
      ]
    }
  ];

  console.log('Sending initial PID params request:', {
    model,
    messages,
    // temperature: 0.7,
    // max_tokens: 1000
  });

  const response = await openai.chat.completions.create({
    model,
    messages,
    // temperature: 0.7,
    // max_tokens: 1000
  });

  console.log('Received initial PID params response:', response.choices[0].message);

  return response.choices[0].message.content;
};

export const generateUpdatedPIDParams = async (
  openai: OpenAI,
  model: string,
  previousInteractions: string[],
  currentParams: { Kp: number; Ki: number; Kd: number },
  graphImage: string
) => {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a PID tuning expert. Analyze the system's response graph and current parameters to suggest improved PID parameters. Consider the historical context of previous tuning attempts. Finish by specifying the next Kp, Ki, and Kd values to try."
    },
    {
      role: "user",
      content: [
        {
          type: "text" as const,
          text: `Previous interactions:\n${previousInteractions.join('\n\n')}\n\nCurrent PID Parameters:\nKp: ${currentParams.Kp}\nKi: ${currentParams.Ki}\nKd: ${currentParams.Kd}`
        },
        {
          type: "image_url" as const,
          image_url: {
            url: graphImage,
            detail: "high" as const
          }
        }
      ]
    }
  ];

  console.log('Sending updated PID params request:', {
    model,
    messages,
    // temperature: 0.7,
    // max_tokens: 1000
  });

  const response = await openai.chat.completions.create({
    model,
    messages,
    // temperature: 0.7,
    // max_tokens: 1000
  });

  console.log('Received updated PID params response:', response.choices[0].message);

  return response.choices[0].message.content;
}; 