
export const calculateTrimester = (dueDate: Date): number => {
  if (!dueDate) return 1;
  
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  
  // Calculate weeks of pregnancy
  const pregnancyDuration = 40; // weeks
  const millisecondsLeft = dueDateObj.getTime() - today.getTime();
  const weeksLeft = millisecondsLeft / (1000 * 60 * 60 * 24 * 7);
  const currentWeek = Math.max(1, Math.min(40, Math.round(pregnancyDuration - weeksLeft)));
  
  // Determine trimester
  if (currentWeek <= 12) return 1;
  if (currentWeek <= 27) return 2;
  return 3;
};

export const calculateWeek = (dueDate: Date): number => {
  if (!dueDate) return 1;
  
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  
  // Calculate weeks of pregnancy
  const pregnancyDuration = 40; // weeks
  const millisecondsLeft = dueDateObj.getTime() - today.getTime();
  const weeksLeft = millisecondsLeft / (1000 * 60 * 60 * 24 * 7);
  return Math.max(1, Math.min(40, Math.round(pregnancyDuration - weeksLeft)));
};

export const getTrimesterInfo = (trimester: number) => {
  switch(trimester) {
    case 1:
      return {
        title: "First Trimester",
        description: "Your baby is developing rapidly during this crucial time. Focus on good nutrition and rest as you may experience morning sickness and fatigue.",
        tips: [
          "Take prenatal vitamins with folic acid",
          "Stay hydrated throughout the day",
          "Get plenty of rest when you feel tired",
          "Try small, frequent meals to combat nausea"
        ]
      };
    case 2:
      return {
        title: "Second Trimester",
        description: "Often called the 'golden period' of pregnancy. You may feel more energetic as morning sickness subsides and your baby continues to grow.",
        tips: [
          "Start or continue gentle exercise routines",
          "Begin planning your baby's nursery",
          "Look into childbirth classes",
          "Enjoy feeling your baby's movements"
        ]
      };
    case 3:
      return {
        title: "Third Trimester",
        description: "Your baby is putting on weight and developing fully. You may feel more tired and uncomfortable as your due date approaches.",
        tips: [
          "Prepare your birth plan",
          "Pack your hospital bag",
          "Practice relaxation techniques",
          "Sleep with supportive pillows",
          "Finalize preparations for baby's arrival"
        ]
      };
    default:
      return {
        title: "Pregnancy Journey",
        description: "Track your pregnancy journey and prepare for your baby's arrival.",
        tips: [
          "Set up your profile with your due date",
          "Track symptoms and moods",
          "Plan your nutrition and exercise"
        ]
      };
  }
};
