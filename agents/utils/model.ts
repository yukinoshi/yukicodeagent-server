import { ChatOpenAI } from "@langchain/openai"
import { ZodType } from "zod"
import "dotenv/config"
let MiMoInstance: ChatOpenAI | null = null
let DeepSeekInstance: ChatOpenAI | null = null
let GLMInstance: ChatOpenAI | null = null
let QwenInstance: ChatOpenAI | null = null

/**
 * 获取 MiMo 主模型实例（用于大部分节点和图像识别）
 * 支持 Function Calling，结构化输出能力强
 * @returns MiMo 主模型实例
 */
export function getMiMoModel() {
    if (!MiMoInstance) {
        MiMoInstance = new ChatOpenAI({
            model: process.env.MIMO_MODEL,
            apiKey: process.env.MIMO_API_KEY,
            temperature: 0,
            configuration: {
                baseURL: process.env.MIMO_BASE_URL || "https://api.deepseek.com",
            },
        });
    }
    return MiMoInstance;
}

/**
 * 获取 DeepSeek 主模型实例（用于大部分节点）
 * 支持 Function Calling，结构化输出能力强
 * @returns DeepSeek 主模型实例
 */
export function getDeepSeekModel() {
    if (!DeepSeekInstance) {
        DeepSeekInstance = new ChatOpenAI({
            model: process.env.DEEPSEEK_MODEL,
            apiKey: process.env.DEEPSEEK_API_KEY,
            temperature: 0,
            configuration: {
                baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
            },
        });
    }
    return DeepSeekInstance;
}

/**
 * 获取 GLM 主模型实例（用于大部分节点）
 * 支持 Function Calling，结构化输出能力强
 * @returns GLM 主模型实例
 */
export function getGLMModel() {
    if (!GLMInstance) {
        GLMInstance = new ChatOpenAI({
            model: process.env.GLM_MODEL,
            apiKey: process.env.GLM_API_KEY,
            temperature: 0,
            configuration: {
                baseURL: process.env.GLM_BASE_URL || "https://api.glm.com",
            },
        });
    }
    return GLMInstance;
}

/**
 * 获取 Qwen 主模型实例（用于大部分节点，识别图片）
 * 支持 Function Calling，结构化输出能力强
 * @returns Qwen 主模型实例
 */
export function getQwenModel() {
    if (!QwenInstance) {
        QwenInstance = new ChatOpenAI({
            model: process.env.QWEN_MODEL,
            apiKey: process.env.QWEN_API_KEY,
            temperature: 0,
            configuration: {
                baseURL: process.env.QWEN_BASE_URL || "https://api.qwen.com",
            },
        });
    }
    return QwenInstance;
}
/**
 * 获取当前配置的主模型
 * @returns 返回当前默认主模型的实例
 */
export function getMainModel() {
    const provider = process.env.MAIN_MODEL_PROVIDER || "deepseek";

    switch (provider.toLowerCase()) {
        case "glm":
            console.log("[Model] Using GLM as main model");
            return getGLMModel();
        case "deepseek":
            console.log("[Model] Using DeepSeek as main model");
            return getDeepSeekModel();
        case "qwen":
            console.log("[Model] Using Qwen as main model");
            return getQwenModel();
        case "mimo":
        default:
            console.log("[Model] Using MiMo as main model");
            return getMiMoModel();
    }
}
/**
 * 将大模型输出约束为固定数据结构的工具函数
 * @param schema 通过zod约束返回类型
 * @returns 返回结构化约束的对象
 */
export function getStructuredModel<T extends ZodType<any>>(schema: T) {
    const model = getMainModel();
    return model.withStructuredOutput(schema,{
        method: "functionCalling",
        includeRaw: false
    });
}

export function getModel() {
    return getMainModel();
}

export function getMainModelProviderName(): string {
    return process.env.MAIN_MODEL_PROVIDER || "deepseek";
}