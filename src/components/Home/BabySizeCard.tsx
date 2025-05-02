
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBabySizeForWeek } from "@/utils/babySizeData";
import { calculateWeek } from "@/utils/trimesterHelper";
import { getCurrentUser } from "@/utils/localStorage";
import { BabySize } from "@/types";

const BabySizeCard = () => {
  const [babySize, setBabySize] = useState<BabySize | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(1);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.dueDate) {
      const week = calculateWeek(new Date(user.dueDate));
      setPregnancyWeek(week);
      setBabySize(getBabySizeForWeek(week));
    } else {
      // Default to week 12 if no due date
      setBabySize(getBabySizeForWeek(12));
    }
  }, []);

  if (!babySize) return null;

  // Define emoji mapping for common fruits/objects
  const getFruitEmoji = (fruit: string) => {
    const fruitToEmoji: {[key: string]: string} = {
      "poppy seed": "🌱",
      "apple seed": "🍎",
      "sweet pea": "🫛",
      "blueberry": "🫐",
      "raspberry": "🍓",
      "cherry": "🍒",
      "strawberry": "🍓",
      "lime": "🍋",
      "lemon": "🍋",
      "orange": "🍊",
      "avocado": "🥑",
      "mango": "🥭",
      "banana": "🍌",
      "carrot": "🥕",
      "corn": "🌽",
      "papaya": "🥔",
      "eggplant": "🍆",
      "cucumber": "🥒",
      "grapefruit": "🍊",
      "cauliflower": "🥦",
      "lettuce": "🥬",
      "coconut": "🥥",
      "broccoli": "🥦",
      "cabbage": "🥬",
      "squash": "🎃",
      "pumpkin": "🎃",
      "watermelon": "🍉",
    };
    
    // Find partial matches
    for (const [key, emoji] of Object.entries(fruitToEmoji)) {
      if (fruit.toLowerCase().includes(key.toLowerCase())) {
        return emoji;
      }
    }
    
    // Default emoji if no match
    return "👶";
  };

  const fruitEmoji = getFruitEmoji(babySize.fruit);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-mama-lavender bg-opacity-30 pb-2">
        <CardTitle className="text-lg font-medium">
          Your Baby This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <motion.div 
            className="text-3xl mb-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Week {pregnancyWeek}
          </motion.div>
          <motion.div 
            className="text-xl font-semibold text-primary mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Size of a {babySize.fruit}
          </motion.div>
          
          <motion.div 
            className="bg-mama-softblue p-6 rounded-full mb-4 w-28 h-28 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              y: [0, -10, 0],
              transition: { 
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              }
            }}
            onClick={() => setShowInfo(!showInfo)}
          >
            <span className="text-5xl">{fruitEmoji}</span>
          </motion.div>
          
          <motion.div 
            className="text-sm text-muted-foreground mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Length: {babySize.length}
          </motion.div>
          <motion.div 
            className="text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Weight: {babySize.weight}
          </motion.div>
          
          <motion.p 
            className="text-center text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: showInfo ? 1 : 0,
              height: showInfo ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {babySize.description}
          </motion.p>
          
          {!showInfo && (
            <motion.p 
              className="text-xs text-primary mt-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowInfo(true)}
            >
              Tap the {babySize.fruit} to learn more!
            </motion.p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BabySizeCard;
