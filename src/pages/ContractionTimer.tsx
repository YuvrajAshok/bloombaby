
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { format, differenceInSeconds, formatDistance } from "date-fns";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveContractionSession, getContractionSessions, saveContraction } from "@/utils/localStorage";
import { Contraction, ContractionSession } from "@/types";
import { Timer, PlayCircle, PauseCircle, StopCircle, AlertTriangle } from "lucide-react";

const ContractionTimer = () => {
  const { toast } = useToast();
  const [isTimingSession, setIsTimingSession] = useState(false);
  const [isTimingContraction, setIsTimingContraction] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [contractionStartTime, setContractionStartTime] = useState<Date | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ContractionSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [contractionDuration, setContractionDuration] = useState(0); // seconds
  const [intensity, setIntensity] = useState<"mild" | "moderate" | "strong">("moderate");
  const [pastSessions, setPastSessions] = useState<ContractionSession[]>([]);

  useEffect(() => {
    loadPastSessions();

    // Check for active session
    const sessions = getContractionSessions();
    const activeSession = sessions.find(s => s.isActive);
    if (activeSession) {
      setIsTimingSession(true);
      setSessionStartTime(new Date(activeSession.startTime));
      setCurrentSessionId(activeSession.id);
      setCurrentSession(activeSession);
    }
  }, []);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isTimingSession && sessionStartTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const seconds = differenceInSeconds(now, sessionStartTime);
        setElapsedTime(seconds);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimingSession, sessionStartTime]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isTimingContraction && contractionStartTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const seconds = differenceInSeconds(now, contractionStartTime);
        setContractionDuration(seconds);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimingContraction, contractionStartTime]);

  const loadPastSessions = () => {
    setPastSessions(getContractionSessions().filter(s => !s.isActive));
  };

  const startSession = () => {
    const now = new Date();
    const sessionId = uuidv4();
    
    const newSession: ContractionSession = {
      id: sessionId,
      date: now,
      startTime: now,
      contractions: [],
      isActive: true,
    };
    
    saveContractionSession(newSession);
    setCurrentSession(newSession);
    setCurrentSessionId(sessionId);
    setIsTimingSession(true);
    setSessionStartTime(now);
    
    toast({
      title: "Contraction timing started",
      description: "Press the button when a contraction begins",
    });
  };

  const startContraction = () => {
    if (!isTimingSession || !currentSessionId) return;
    
    const now = new Date();
    setIsTimingContraction(true);
    setContractionStartTime(now);
    setContractionDuration(0);
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const stopContraction = () => {
    if (!isTimingContraction || !contractionStartTime || !currentSessionId) return;
    
    const now = new Date();
    const duration = differenceInSeconds(now, contractionStartTime);
    
    // Create new contraction
    const newContraction: Contraction = {
      id: uuidv4(),
      date: new Date(),
      startTime: contractionStartTime,
      endTime: now,
      duration: duration,
      intensity: intensity,
    };
    
    // Add to current session
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        contractions: [...currentSession.contractions, newContraction]
      };
      saveContractionSession(updatedSession);
      setCurrentSession(updatedSession);
    }
    
    saveContraction(newContraction, currentSessionId);
    
    setIsTimingContraction(false);
    setContractionStartTime(null);
    setContractionDuration(0);
  };

  const endSession = () => {
    if (currentSession) {
      const endTime = new Date();
      const updatedSession = {
        ...currentSession,
        isActive: false,
        endTime: endTime
      };
      
      saveContractionSession(updatedSession);
      loadPastSessions();
      
      toast({
        title: "Session ended",
        description: `Recorded ${currentSession.contractions.length} contractions`,
      });
    }
    
    setIsTimingSession(false);
    setIsTimingContraction(false);
    setSessionStartTime(null);
    setContractionStartTime(null);
    setCurrentSessionId(null);
    setCurrentSession(null);
    setElapsedTime(0);
    setContractionDuration(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to calculate average contraction duration
  const getAverageDuration = (contractions: Contraction[]) => {
    if (contractions.length === 0) return 0;
    
    const sum = contractions.reduce((total, contraction) => {
      return total + (contraction.duration || 0);
    }, 0);
    
    return Math.round(sum / contractions.length);
  };

  // Function to calculate average interval between contractions
  const getAverageInterval = (contractions: Contraction[]) => {
    if (contractions.length < 2) return 0;
    
    let totalInterval = 0;
    
    for (let i = 1; i < contractions.length; i++) {
      const current = new Date(contractions[i].startTime);
      const previous = new Date(contractions[i - 1].startTime);
      totalInterval += differenceInSeconds(current, previous);
    }
    
    return Math.round(totalInterval / (contractions.length - 1));
  };

  // Function to get labor phase based on contraction patterns
  const getLaborPhase = (contractions: Contraction[]) => {
    if (contractions.length < 3) return "Not enough data";
    
    const avgInterval = getAverageInterval(contractions);
    const intervalMinutes = Math.floor(avgInterval / 60);
    
    if (intervalMinutes < 3) return "Active labor";
    if (intervalMinutes < 5) return "Active labor";
    if (intervalMinutes < 10) return "Early labor";
    
    return "Early labor";
  };

  // Function to determine if it's time to go to hospital
  const shouldGoToHospital = (contractions: Contraction[]) => {
    if (contractions.length < 5) return false;
    
    const recent = contractions.slice(-5);
    const avgInterval = getAverageInterval(recent);
    const avgDuration = getAverageDuration(recent);
    
    // 5-1-1 rule: Contractions 5 min apart, lasting 1 min, for 1 hour
    return avgInterval <= 300 && avgDuration >= 60;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Contraction Timer</h1>
          <p className="text-muted-foreground">
            Track your contractions to monitor labor progress
          </p>
        </div>

        <Card className={`transition-all ${isTimingSession ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <span>
                {isTimingSession
                  ? "Timing Contractions"
                  : "Start Timing Contractions"}
              </span>
            </CardTitle>
            <CardDescription>
              {isTimingSession
                ? `Session started at ${
                    sessionStartTime ? format(sessionStartTime, "h:mm a") : ""
                  }`
                : "Track the length and frequency of your contractions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isTimingSession ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {formatTime(elapsedTime)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total time
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {currentSession?.contractions.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contractions
                    </p>
                  </div>
                </div>

                {isTimingContraction ? (
                  <div className="w-full space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="text-5xl font-bold text-primary">
                        {Math.floor(contractionDuration)}
                      </div>
                      <p className="text-sm text-primary">seconds</p>
                    </div>
                    
                    <Progress
                      value={Math.min((contractionDuration / 120) * 100, 100)}
                      className="w-full h-2"
                    />
                    
                    <div className="w-full">
                      <label className="text-sm font-medium block mb-1">
                        Intensity
                      </label>
                      <Select
                        onValueChange={(val: "mild" | "moderate" | "strong") => setIntensity(val)}
                        value={intensity}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="strong">Strong</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      onClick={stopContraction}
                      variant="outline"
                      size="lg"
                      className="w-full flex gap-2 items-center"
                    >
                      <PauseCircle className="h-5 w-5" />
                      <span>Contraction Ended</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={startContraction}
                    size="lg"
                    className="w-full py-8 text-lg flex gap-2 items-center"
                  >
                    <PlayCircle className="h-5 w-5" />
                    <span>Contraction Started</span>
                  </Button>
                )}
                
                {currentSession && currentSession.contractions.length > 0 && (
                  <div className="w-full border rounded-md p-4">
                    <h3 className="font-medium mb-2">Current Session</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Duration</p>
                        <p className="font-medium">
                          {getAverageDuration(currentSession.contractions)} seconds
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Interval</p>
                        <p className="font-medium">
                          {formatDistance(0, getAverageInterval(currentSession.contractions) * 1000)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phase</p>
                        <p className="font-medium">
                          {getLaborPhase(currentSession.contractions)}
                        </p>
                      </div>
                    </div>
                    
                    {shouldGoToHospital(currentSession.contractions) && (
                      <div className="mt-4 bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-600 border border-red-200">
                        <AlertTriangle className="h-5 w-5" />
                        <p className="text-sm font-medium">
                          Consider going to the hospital now (5-1-1 pattern detected)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="mb-6">
                  Timing your contractions helps determine your labor progress.
                  Press start to begin tracking when contractions begin and end.
                </p>
                <Button onClick={startSession} size="lg">
                  Start Timing
                </Button>
              </div>
            )}
          </CardContent>
          {isTimingSession && (
            <CardFooter className="justify-center">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={endSession}
              >
                <StopCircle className="h-5 w-5" />
                <span>End Session</span>
              </Button>
            </CardFooter>
          )}
        </Card>

        {pastSessions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Past Sessions</h2>
            <div className="grid grid-cols-1 gap-4">
              {pastSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {format(new Date(session.date), "MMM d, yyyy")}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(session.startTime), "h:mm a")} - 
                      {session.endTime && format(new Date(session.endTime), " h:mm a")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Contractions</p>
                        <p className="font-medium">{session.contractions.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Duration</p>
                        <p className="font-medium">
                          {getAverageDuration(session.contractions)} sec
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Interval</p>
                        <p className="font-medium">
                          {Math.floor(getAverageInterval(session.contractions) / 60)} min
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge>
                        {getLaborPhase(session.contractions)}
                      </Badge>
                      {shouldGoToHospital(session.contractions) && (
                        <Badge variant="outline" className="text-red-500 border-red-300">
                          Hospital pattern detected
                        </Badge>
                      )}
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

export default ContractionTimer;
