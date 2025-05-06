
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { format, differenceInMinutes } from "date-fns";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { saveKickCount, getKickCounts, deleteKickCount } from "@/utils/localStorage";
import { KickCount } from "@/types";
import { Timer, Baby, Trash2, Clock, Calendar } from "lucide-react";

const KickCounter = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [pastCounts, setPastCounts] = useState<KickCount[]>([]);

  useEffect(() => {
    loadPastCounts();
  }, []);

  const loadPastCounts = () => {
    setPastCounts(getKickCounts());
  };

  const handleStartCounting = () => {
    setIsActive(true);
    setCount(0);
    setStartTime(new Date());
    toast({
      title: "Kick counting started",
      description: "Tap the button each time you feel your baby move",
    });
  };

  const handleCountKick = () => {
    if (isActive) {
      setCount((prev) => prev + 1);
      
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleFinish = () => {
    if (startTime && isActive) {
      const endTime = new Date();
      const duration = differenceInMinutes(endTime, startTime);
      
      // Ensure all required properties are explicitly set
      const kickRecord: KickCount = {
        id: uuidv4(),
        date: new Date(),
        startTime: startTime,
        endTime: endTime,
        count: count,
        duration: duration,
        notes: notes || undefined,
      };
      
      saveKickCount(kickRecord);
      loadPastCounts();
      
      toast({
        title: "Kick counting session saved",
        description: `Recorded ${count} kicks over ${duration} minutes`,
      });
      
      // Reset the form
      setIsActive(false);
      setCount(0);
      setStartTime(null);
      setNotes("");
    }
  };

  const handleDelete = (id: string) => {
    // Use the deleteKickCount function from localStorage.ts
    deleteKickCount(id);
    // Update the UI after deletion
    loadPastCounts();
    
    toast({
      title: "Record deleted",
      description: "Kick count record has been removed",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Kick Counter</h1>
          <p className="text-muted-foreground">
            Track your baby's movements to monitor their wellbeing
          </p>
        </div>

        <Card className={`transition-all ${isActive ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              <span>{isActive ? "Counting Kicks..." : "Start Counting Kicks"}</span>
            </CardTitle>
            <CardDescription>
              {isActive 
                ? `Started ${startTime ? format(startTime, "h:mm a") : ""} - Tap when you feel movement`
                : "Experts recommend counting 10 kicks daily"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isActive ? (
              <div className="flex flex-col items-center space-y-8">
                <div className="text-center">
                  <div className="text-7xl font-bold text-primary">{count}</div>
                  <p className="text-sm text-muted-foreground mt-2">kicks counted</p>
                </div>
                
                <Button 
                  onClick={handleCountKick}
                  size="lg"
                  className="w-32 h-32 rounded-full text-3xl animate-pulse hover:scale-105"
                >
                  +1
                </Button>
                
                <div className="w-full space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes (optional)
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Any observations about the movements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="mb-6">
                  Counting your baby's kicks is an important way to monitor their health.
                  Most care providers recommend counting 10 movements within 2 hours.
                </p>
                <Button onClick={handleStartCounting} size="lg">
                  Start Counting
                </Button>
              </div>
            )}
          </CardContent>
          {isActive && (
            <CardFooter className="justify-center">
              <Button 
                variant="outline" 
                onClick={handleFinish}
                className="w-full"
              >
                Finish Counting
              </Button>
            </CardFooter>
          )}
        </Card>

        {pastCounts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Past Records</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pastCounts.map((record) => (
                <Card key={record.id} className="overflow-hidden group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <CardDescription>
                          {format(new Date(record.date), "MMM d, yyyy")}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record.id)}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Baby className="h-4 w-4 text-primary" />
                          <span className="font-medium">{record.count} kicks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {record.duration} minutes
                          </span>
                        </div>
                        {record.notes && (
                          <p className="text-sm">{record.notes}</p>
                        )}
                      </div>
                      <Badge variant={record.count >= 10 ? "default" : "outline"}>
                        {record.count >= 10 ? "Good" : "Low"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default KickCounter;
