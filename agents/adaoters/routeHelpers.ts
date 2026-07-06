
export function getLastMessage(messages: any[]): any {
    if (!Array.isArray(messages) || messages.length === 0) return null;
    return messages[messages.length - 1];
}

export function getLastText(messages: any[]): string {
    const lastMsg = getLastMessage(messages);
    return typeof lastMsg?.content === "string" ? lastMsg.content : "";
}

export function hasImageAttachment(messages: any[]): boolean {
    const lastMsg = getLastMessage(messages);
    const attachments = Array.isArray(lastMsg?.attachments)
        ? lastMsg.attachments
        : [];
    return attachments.some((att: any) => att.type === "image" && att.url);
}
/**
 * 避免把链接当初普通文本
 * @param messages 
 * @returns 返回去掉链接后的文本是否为空
 */
export function hasTextPrompt(messages: any[]): boolean {
    const content = getLastText(messages);

    const textWithoutUrls = content.replace(/https?:\/\/[^\s]+/g, "").trim();
    return textWithoutUrls.length > 0;
}
/**
 * 判断是否是修改请求，主要用于判断用户是否在请求对现有内容进行修改、优化或重构
 * @param messages 
 * @returns 
 */
export function isModificationRequest(messages: any[]): boolean {
    const content = getLastText(messages).toLowerCase();
    if (!content) return false;
    const keywords = [
        "modify",
        "update",
        "refactor",
        "change",
        "修改",
        "改一下",
        "优化",
        "重构",
        "在现有",
        "基于当前",
    ];
    return keywords.some((k) => content.includes(k));
}