import { mockMessageSummaries, mockSmartReplies } from "../mockData";

/**
 * Get smart reply suggestions for a message
 */
export async function aiGenerateReplies(text: string): Promise<string[]> {
  const trimmedText = text?.trim();
  if (!trimmedText) return ["Got it", "I see", "Thanks for sharing"];

  // Check for exact matches in our mock data
  const exactMatch = mockSmartReplies[trimmedText];
  if (exactMatch) return exactMatch;

  // Check for partial matches
  const lowerText = trimmedText.toLowerCase();

  // Check for questions
  if (lowerText.includes("?")) {
    if (lowerText.includes("time") || lowerText.includes("when")) {
      return [
        "Let me check my calendar",
        "How about tomorrow?",
        "I'm free this afternoon",
      ];
    }
    return ["Good question", "Let me think about that", "That's interesting"];
  }

  // Check for common phrases
  if (lowerText.includes("thanks") || lowerText.includes("thank you")) {
    return ["You're welcome!", "No problem", "Anytime!"];
  }

  if (
    lowerText.includes("hello") ||
    lowerText.includes("hi ") ||
    lowerText.includes("hey")
  ) {
    return ["Hi there!", "Hello!", "Hey, how are you?"];
  }

  // Default responses
  return ["Got it", "I understand", "Thanks for sharing"];
}

/**
 * Get a summary for a message based on its ID or content
 */
export async function aiSummarizeMessage(
  text: string,
  messageId?: string
): Promise<string> {
  // If we have a pre-defined summary for this message ID, use it
  if (messageId && messageId in mockMessageSummaries) {
    return mockMessageSummaries[messageId];
  }

  // For messages without a pre-defined summary
  if (!text || text.length < 100) return text;

  // Content-based fallbacks
  if (text.toLowerCase().includes("project")) {
    return "Discussion about project details and next steps.";
  }

  if (text.toLowerCase().includes("meeting")) {
    return "Information about upcoming meeting schedule.";
  }

  // Generic fallback
  return `${text.substring(0, 50)}...`;
}
