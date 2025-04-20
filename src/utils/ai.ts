/**
 * Chat-Sphere AI Utility
 *
 * This module provides AI-like response generation functionality
 * for the Chat-Sphere application without external dependencies.
 *
 * It uses pattern matching and predefined responses to simulate
 * AI capabilities while avoiding WebAssembly compatibility issues.
 */

// Define the types for our AI functions
interface IAIReplyOptions {
  maxReplies?: number;
  minLength?: number;
  maxLength?: number;
  temperature?: number;
}

const DEFAULT_OPTIONS: IAIReplyOptions = {
  maxReplies: 3,
  minLength: 1,
  maxLength: 50,
  temperature: 0.7,
};

/**
 * Generates reply suggestions based on the input message
 * Uses pattern matching for common responses
 *
 * @param message - The user's message to generate replies for
 * @param options - Configuration options for reply generation
 * @returns Promise resolving to an array of suggested replies
 */
export async function aiGenerateReplies(
  message: string,
  options: IAIReplyOptions = {}
): Promise<string[]> {
  // Merge default options with provided options
  const config = { ...DEFAULT_OPTIONS, ...options };
  const maxReplies = config.maxReplies || 3;

  try {
    // Simple response mapping for common messages
    // This provides instant responses without loading the model for basic interactions
    const quickResponses: Record<string, string[]> = {
      hello: ["Hi there!", "Hello!", "Hey, how can I help?"],
      hi: ["Hello!", "Hi there!", "Hey!"],
      "how's it going": [
        "Pretty good, thanks!",
        "Good, how about you?",
        "Great! What's up?",
      ],
      "how are you": [
        "I'm doing well, thanks!",
        "Great! How about you?",
        "All good here!",
      ],
      thanks: ["You're welcome!", "No problem!", "Happy to help!"],
      "thank you": ["You're welcome!", "Glad I could help!", "My pleasure!"],
      goodbye: ["Goodbye!", "See you later!", "Take care!"],
      bye: ["Bye now!", "See you soon!", "Take care!"],
    };

    // Check for quick responses first
    const normalizedMessage = message.toLowerCase().trim();
    for (const [key, responses] of Object.entries(quickResponses)) {
      if (normalizedMessage.includes(key)) {
        // Return a subset of the responses up to maxReplies
        return responses.slice(0, maxReplies);
      }
    }

    console.log("Generating smart responses...");

    // Add a small delay to simulate AI thinking time (optional)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Use smart pattern matching as a lightweight alternative to real AI
    return getSmartReplies(message, maxReplies);
  } catch (error) {
    console.error("Error generating AI replies:", error);
    return ["I'm not sure how to respond to that."];
  }
}

/**
 * Provides smart replies based on message patterns
 */
function getSmartReplies(message: string, maxReplies: number): string[] {
  const lowerMessage = message.toLowerCase();

  // Question patterns
  if (message.endsWith("?")) {
    if (lowerMessage.includes("what") && lowerMessage.includes("your name")) {
      return [
        "I'm ChatSphere!",
        "My name is ChatSphere.",
        "I'm your AI assistant.",
      ].slice(0, maxReplies);
    } else if (lowerMessage.includes("how") && lowerMessage.includes("work")) {
      return [
        "I use pattern matching to generate responses.",
        "I analyze your message and suggest appropriate replies.",
        "I'm designed to provide helpful responses.",
      ].slice(0, maxReplies);
    } else if (lowerMessage.includes("weather")) {
      return [
        "It's a lovely day today!",
        "I don't have access to weather data, but I hope it's nice where you are!",
        "Would you like me to help you check a weather service?",
      ].slice(0, maxReplies);
    } else if (lowerMessage.includes("time")) {
      return [
        "It's currently chat time!",
        "I don't have access to the current time.",
        "Time for a great conversation!",
      ].slice(0, maxReplies);
    } else {
      return [
        "Yes, that's right!",
        "I think so!",
        "That's a great question.",
        "Let me think about that.",
      ].slice(0, maxReplies);
    }
  }

  // Statement patterns
  if (lowerMessage.includes("i like") || lowerMessage.includes("i love")) {
    return [
      "Tell me more about that!",
      "That's awesome!",
      "I can see why you'd feel that way.",
    ].slice(0, maxReplies);
  } else if (
    lowerMessage.includes("i don't") ||
    lowerMessage.includes("i hate") ||
    lowerMessage.includes("i dislike")
  ) {
    return [
      "I understand how you feel.",
      "That must be frustrating.",
      "What would you prefer instead?",
    ].slice(0, maxReplies);
  } else if (lowerMessage.includes("help me")) {
    return [
      "I'd be happy to help!",
      "What specific assistance do you need?",
      "Let me know how I can help you.",
    ].slice(0, maxReplies);
  } else if (lowerMessage.length < 10) {
    return ["Tell me more.", "Interesting!", "Go on..."].slice(0, maxReplies);
  } else {
    return [
      "I understand what you mean.",
      "That makes sense.",
      "I see your point.",
    ].slice(0, maxReplies);
  }
}
