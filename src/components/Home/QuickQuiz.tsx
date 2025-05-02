
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/utils/localStorage";
import { calculateTrimester } from "@/utils/trimesterHelper";

const quizData = {
  1: [
    {
      question: "What helps with morning sickness?",
      options: [
        "Skipping meals",
        "Small, frequent meals",
        "Drinking large amounts of water at once",
        "Eating only at night"
      ],
      correctAnswer: 1
    },
    {
      question: "Which nutrient is most important in early pregnancy?",
      options: [
        "Vitamin C",
        "Calcium",
        "Folic Acid",
        "Iron"
      ],
      correctAnswer: 2
    },
    {
      question: "When does the baby's heart begin to beat?",
      options: [
        "At 8 weeks",
        "At 12 weeks",
        "At 16 weeks",
        "At 5-6 weeks"
      ],
      correctAnswer: 3
    }
  ],
  2: [
    {
      question: "When might you start to feel baby movements?",
      options: [
        "8-10 weeks",
        "16-22 weeks",
        "24-28 weeks",
        "30+ weeks"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the 'pregnancy glow' attributed to?",
      options: [
        "Increased blood volume and oil production",
        "Hormones affecting mood",
        "A mother's happiness",
        "Prenatal vitamins"
      ],
      correctAnswer: 0
    },
    {
      question: "When is the best time to start sleeping on your side?",
      options: [
        "First trimester",
        "Second trimester",
        "Only third trimester",
        "Only when uncomfortable"
      ],
      correctAnswer: 1
    }
  ],
  3: [
    {
      question: "Which position is best for sleeping in the third trimester?",
      options: [
        "On your back",
        "On your left side",
        "On your stomach",
        "Sitting up"
      ],
      correctAnswer: 1
    },
    {
      question: "What is Braxton Hicks?",
      options: [
        "A type of prenatal vitamin",
        "A baby position",
        "Practice contractions",
        "A type of pregnancy test"
      ],
      correctAnswer: 2
    },
    {
      question: "When should you call your doctor about contractions?",
      options: [
        "When they're 5 minutes apart for an hour",
        "Only when your water breaks",
        "After 24 hours of any contractions",
        "Only if they're painful"
      ],
      correctAnswer: 0
    }
  ]
};

const QuickQuiz = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Get user's trimester or default to 1
  const user = getCurrentUser();
  const trimester = user?.dueDate 
    ? calculateTrimester(new Date(user.dueDate)) 
    : (user?.currentTrimester || 1);
  
  const questions = quizData[trimester as keyof typeof quizData];
  
  const handleStartQuiz = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setSelectedQuestion(randomIndex);
    setSelectedAnswer(null);
    setShowResult(false);
  };
  
  const handleSubmitAnswer = () => {
    setShowResult(true);
  };
  
  const handleNewQuestion = () => {
    handleStartQuiz();
  };
  
  const currentQuestion = selectedQuestion !== null ? questions[selectedQuestion] : null;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  
  return (
    <Card className="h-full">
      <CardHeader className="bg-mama-lavender bg-opacity-30 pb-2">
        <CardTitle className="text-lg font-medium">
          Pregnancy Quick Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {selectedQuestion === null ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center mb-4">
              Test your pregnancy knowledge with a quick question
            </p>
            <Button onClick={handleStartQuiz}>
              Start Quiz
            </Button>
          </div>
        ) : (
          <>
            {!showResult ? (
              <div className="space-y-4">
                <h3 className="font-medium">{currentQuestion?.question}</h3>
                <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => setSelectedAnswer(parseInt(v))}>
                  {currentQuestion?.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={idx.toString()} id={`answer-${idx}`} />
                      <Label htmlFor={`answer-${idx}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  onClick={handleSubmitAnswer} 
                  className="w-full" 
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <p className="font-medium">
                    {isCorrect ? 'Correct! Great job!' : 'Not quite right!'}
                  </p>
                  <p className="mt-2 text-sm">
                    {currentQuestion?.options[currentQuestion?.correctAnswer]}
                  </p>
                </div>
                <Button onClick={handleNewQuestion} className="w-full">
                  Try Another Question
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickQuiz;
