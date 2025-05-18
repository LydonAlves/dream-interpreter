import { backendLink } from "@/utils/backendLink";

export type Step0InputData = {
  dream: string;
}

export type Step1InputData = {
  title: string;
  dream: string;
  symbols: { symbol: string; meaning: string }[];
  emotion: string;
  context: string;
};

export type Step2InputData = {
  resonated: string;
  disagreed: string;
};

export type Step3InputData = {
  goal: string;
};

export type AnalyzeDreamPayload =
  | {
      userId: string;
      dreamId: string;
      step: 0;
      inputData: Step0InputData;
    }
  | {
      userId: string;
      dreamId: string;
      step: 1;
      inputData: Step1InputData;
    }
  | {
      userId: string;
      dreamId: string;
      step: 2;
      inputData: Step2InputData;
    }
  | {
      userId: string;
      dreamId: string;
      step: 3;
      inputData: Step3InputData;
    };

 
export const analyzeDream = async ({
  userId,
  dreamId,
  step,
  inputData,
}: AnalyzeDreamPayload) => {
  // console.log("sending dream", inputData);
  try {
    const response = await fetch(`${backendLink}/analyze`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        dream_id: dreamId,
        step,
        input_data: inputData,
      }),
    });

    const json = await response.json();

    if(response.ok) {
      return json.response;
    } else {
      throw new Error(json.detail || "Server error");
    }
  } catch (error) {
    console.log("Dream analysis error:", error);
    throw error;
  }
};