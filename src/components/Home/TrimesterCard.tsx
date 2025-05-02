
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrimesterInfo } from "@/utils/trimesterHelper";
import { getCurrentUser } from "@/utils/localStorage";

const TrimesterCard = () => {
  const [trimester, setTrimester] = useState<number>(1);
  const [trimesterInfo, setTrimesterInfo] = useState(() => getTrimesterInfo(1));

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.currentTrimester) {
      setTrimester(user.currentTrimester);
      setTrimesterInfo(getTrimesterInfo(user.currentTrimester));
    }
  }, []);

  return (
    <Card>
      <CardHeader className="bg-mama-softgreen bg-opacity-40 pb-2">
        <CardTitle className="text-lg font-medium">
          {trimesterInfo.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm mb-4">
          {trimesterInfo.description}
        </p>
        
        <h4 className="font-medium mb-2">Helpful Tips</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {trimesterInfo.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TrimesterCard;
