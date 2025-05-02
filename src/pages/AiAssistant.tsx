
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Baby, Heart, Repeat } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/utils/localStorage";

const AiAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const trimester = getCurrentUser()?.currentTrimester || 1;

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: uuidv4(),
      role: "assistant" as const,
      content: `👋 Hello! I'm your BloomBaby AI assistant. I'm here to help with any questions about pregnancy, prenatal care, postpartum recovery, or baby care. What would you like to know today?${trimester ? ` I see you're in your ${trimester === 1 ? "first" : trimester === 2 ? "second" : "third"} trimester. How are you feeling?` : ""}`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [trimester]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      generateResponse(input);
    }, 1000);
  };
  
  const generateResponse = (userInput: string) => {
    const lowercaseInput = userInput.toLowerCase();
    
    // Simple response logic based on keywords
    let responseContent = "";
    
    if (lowercaseInput.includes("morning sickness") || lowercaseInput.includes("nausea")) {
      responseContent = "Morning sickness is common during the first trimester. Try eating small, frequent meals, staying hydrated, and avoiding strong smells. Ginger tea or crackers might help ease the symptoms. If vomiting is severe, please consult your healthcare provider as you might have hyperemesis gravidarum. 🍵";
    } else if (lowercaseInput.includes("kick") || lowercaseInput.includes("movement")) {
      responseContent = "Baby movements typically start around weeks 16-25. Early movements feel like flutters or 'butterflies' and become stronger over time. By the third trimester, you should feel regular movements. If you notice reduced movement, contact your healthcare provider immediately. 👶";
    } else if (lowercaseInput.includes("diet") || lowercaseInput.includes("eat") || lowercaseInput.includes("food")) {
      responseContent = "A balanced pregnancy diet includes lots of fruits, vegetables, whole grains, lean protein, and healthy fats. Remember to take prenatal vitamins with folic acid, avoid raw fish, undercooked meat, and limit caffeine. Stay hydrated with plenty of water! 🥗🍎";
    } else if (lowercaseInput.includes("labor") || lowercaseInput.includes("birth") || lowercaseInput.includes("contractions")) {
      responseContent = "Labor signs include regular contractions that increase in intensity, rupture of membranes ('water breaking'), and bloody show. Use the 5-1-1 rule: when contractions are 5 minutes apart, lasting 1 minute each, for 1 hour, it's time to head to the hospital. ⏰";
    } else if (lowercaseInput.includes("sleep") || lowercaseInput.includes("insomnia")) {
      responseContent = "Sleep challenges are common during pregnancy. Try sleeping on your left side with pillows supporting your belly and between your knees. Create a relaxing bedtime routine and limit fluids before bed to reduce bathroom trips. 😴";
    } else if (lowercaseInput.includes("exercise") || lowercaseInput.includes("workout")) {
      responseContent = "Regular moderate exercise is beneficial during pregnancy. Walking, swimming, prenatal yoga, and stationary cycling are great options. Aim for 30 minutes most days, but listen to your body and avoid overheating. Always consult your doctor before starting any exercise routine. 🧘‍♀️";
    } else if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
      responseContent = "Hello there! How can I help you with your pregnancy journey today? 👋";
    } else if (lowercaseInput.includes("thank")) {
      responseContent = "You're very welcome! I'm here anytime you need guidance or support during your pregnancy journey. Is there anything else you'd like to know? 💖";
    } else {
      responseContent = "Thank you for your question! During pregnancy, it's always best to discuss specific concerns with your healthcare provider. I can provide general information, but personalized medical advice should come from your doctor. Would you like me to tell you more about prenatal vitamins, exercise during pregnancy, or preparing for labor? 🩺";
    }

    const assistantMessage = {
      id: uuidv4(),
      role: "assistant" as const,
      content: responseContent,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    const userMessage = {
      id: uuidv4(),
      role: "user" as const,
      content: question,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    setTimeout(() => {
      generateResponse(question);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">BloomBaby AI Assistant</h1>
          <p className="text-muted-foreground">
            Ask any questions about pregnancy, prenatal care, or baby development.
          </p>
        </div>
        
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 animate-pulse"
                onClick={() => handleQuickQuestion("What foods should I avoid during pregnancy?")}
              >
                <span>Foods to avoid</span> 🍣
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleQuickQuestion("How can I reduce morning sickness?")}
              >
                <span>Morning sickness tips</span> 🤢
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleQuickQuestion("When will I feel my baby kick?")}
              >
                <span>Baby movements</span> 👶
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleQuickQuestion("What exercises are safe during pregnancy?")}
              >
                <span>Safe exercises</span> 🧘‍♀️
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-mama-purple animate-bounce" />
              Chat with BloomBaby AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 h-[400px] overflow-y-auto mb-4 p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content.split(" ").map((word, i) => {
                      // Simple emoji detection
                      if (
                        word === "🍵" || word === "👶" || word === "🥗" || 
                        word === "🍎" || word === "⏰" || word === "😴" || 
                        word === "🧘‍♀️" || word === "👋" || word === "💖" ||
                        word === "🩺" || word === "🤢" || word === "🍣"
                      ) {
                        return <span key={i} className="inline-block animate-bounce mx-1">{word}</span>;
                      }
                      return <span key={i}>{word}{" "}</span>;
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                    <div className="flex items-center gap-2">
                      <span>Thinking</span>
                      <span className="animate-pulse">...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading} className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-mama-softblue bg-opacity-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-red-500 animate-pulse" />
            <h3 className="font-medium">Important Note</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            This AI assistant provides general information only and is not a substitute for professional medical advice.
            Always consult with your healthcare provider for personalized recommendations.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default AiAssistant;
