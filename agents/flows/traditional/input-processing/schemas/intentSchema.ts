// step1: 意图分析
import { z } from "zod";

/**
 * 辅助函数：将可能的字符串数组转换为真正的数组
 * LLM 有时会将数组序列化为 JSON 字符串，这个函数可以处理这种情况
 */
function safeStringArray() {
  return z
    .union([z.array(z.string()), z.string()])
    .nullable()
    .optional()
    .describe("字符串数组或JSON字符串格式的数组");
}

/**
 * 后处理函数：修复 LLM 返回的字符串数组问题
 * LLM 有时会将数组序列化为 JSON 字符串，这个函数可以处理这种情况
 */
export function fixIntentAssumptions(intent: any): any {
  if (!intent) return intent;

  const fixArray = (val: any): string[] => {
    if (val === null || val === undefined) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return [val];
      }
    }
    return [];
  };

  return {
    ...intent,
    goals: {
      ...intent.goals,
      primary: fixArray(intent.goals?.primary),
      secondary: fixArray(intent.goals?.secondary),
    },
    nonGoals: fixArray(intent.nonGoals),
    assumptions: fixArray(intent.assumptions),
  };
}

export const IntentSchema = z.object({
  product: z.object({
    name: z.string().min(1).describe("应用名称"),
    description: z.string().min(1).describe("应用描述"),
    targetUsers: z.array(z.string()).min(1).describe("目标用户"),
    primaryScenario: z.string().min(1).describe("主要场景"),
  }),
  goals: z.object({
    primary: z.array(z.string()).min(1).describe("应用要实现的主要目标"),
    secondary: safeStringArray().describe("应用要实现的次要目标"),
  }),
  nonGoals: safeStringArray().describe("应用不需要实现的目标"),
  assumptions: safeStringArray().describe("应用设计时的假设条件"),
  category: z.string().describe("应用类型"),
});

export type Intent = z.infer<typeof IntentSchema>;
