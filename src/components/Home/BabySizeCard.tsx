
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBabySizeForWeek } from "@/utils/babySizeData";
import { calculateWeek } from "@/utils/trimesterHelper";
import { getCurrentUser } from "@/utils/localStorage";
import { BabySize } from "@/types";

const BabySizeCard = () => {
  const [babySize, setBabySize] = useState<BabySize | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(1);

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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-mama-lavender bg-opacity-30 pb-2">
        <CardTitle className="text-lg font-medium">
          Your Baby This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-1">
            Week {pregnancyWeek}
          </div>
          <div className="text-xl font-semibold text-primary mb-3">
            Size of a {babySize.fruit}
          </div>
          
          <div className="bg-mama-softblue p-4 rounded-full mb-4 w-24 h-24 flex items-center justify-center animate-float">
            <span className="text-center font-medium">{babySize.fruit}</span>
          </div>
          
          <div className="text-sm text-muted-foreground mb-1">
            Length: {babySize.length}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            Weight: {babySize.weight}
          </div>
          
          <p className="text-center text-sm">
            {babySize.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BabySizeCard;
