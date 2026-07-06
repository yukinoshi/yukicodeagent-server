import { hasTextPrompt } from "./routeHelpers.js";
import { RouteInputAdapter } from "./routeTypes.js";
/**
 * Prompt 路由适配器
 */
export const promptRouteAdapter: RouteInputAdapter = {
    name: "Prompt Route Adapter",
    priority: 70,
    canHandle: ({ messages }) => hasTextPrompt(messages),
    adapt: async ({ messages, mockConfig }) => {
        console.log("[RouteAdapter] Matched: prompt-route");
        return {
            flow: "traditional",
            input: { messages, mockConfig },
            meta: { routeType: "prompt" },
        };
    },
}