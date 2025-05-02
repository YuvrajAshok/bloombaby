
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/Layout/AppLayout";
import { 
  getCurrentUser, 
  getSymptoms, 
  getMoods, 
  getNutrition, 
  getExercises 
} from "@/utils/localStorage";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const Calendar = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventsForDate, setEventsForDate] = useState<any[]>([]);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
  }, [navigate]);
  
  useEffect(() => {
    if (!date) return;
    
    const selectedDateStart = new Date(date);
    selectedDateStart.setHours(0, 0, 0, 0);
    
    const selectedDateEnd = new Date(date);
    selectedDateEnd.setHours(23, 59, 59, 999);
    
    const symptoms = getSymptoms().filter(s => {
      const symptomDate = new Date(s.date);
      return symptomDate >= selectedDateStart && symptomDate <= selectedDateEnd;
    }).map(s => ({ ...s, type: 'symptom' }));
    
    const moods = getMoods().filter(m => {
      const moodDate = new Date(m.date);
      return moodDate >= selectedDateStart && moodDate <= selectedDateEnd;
    }).map(m => ({ ...m, type: 'mood' }));
    
    const nutrition = getNutrition().filter(n => {
      const nutritionDate = new Date(n.date);
      return nutritionDate >= selectedDateStart && nutritionDate <= selectedDateEnd;
    }).map(n => ({ ...n, type: 'nutrition' }));
    
    const exercises = getExercises().filter(e => {
      const exerciseDate = new Date(e.date);
      return exerciseDate >= selectedDateStart && exerciseDate <= selectedDateEnd;
    }).map(e => ({ ...e, type: 'exercise' }));
    
    // Combine all events and sort by date
    const allEvents = [...symptoms, ...moods, ...nutrition, ...exercises].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setEventsForDate(allEvents);
  }, [date]);
  
  const getEventDays = () => {
    const symptoms = getSymptoms();
    const moods = getMoods();
    const nutrition = getNutrition();
    const exercises = getExercises();
    
    const allDates = [
      ...symptoms.map(s => new Date(s.date)),
      ...moods.map(m => new Date(m.date)),
      ...nutrition.map(n => new Date(n.date)),
      ...exercises.map(e => new Date(e.date))
    ];
    
    // Convert dates to strings for comparison (YYYY-MM-DD)
    return allDates.map(date => format(date, 'yyyy-MM-dd'));
  };
  
  const eventDays = getEventDays();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Calendar</h1>
          <p className="text-muted-foreground">
            View all your logs and events on a calendar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                Select a date to view events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  eventDay: (date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    return eventDays.includes(dateStr);
                  }
                }}
                modifiersStyles={{
                  eventDay: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    backgroundColor: 'rgba(126, 105, 171, 0.1)'
                  }
                }}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {date ? format(date, 'MMMM d, yyyy') : 'No date selected'}
              </CardTitle>
              <CardDescription>
                {eventsForDate.length === 0 
                  ? 'No events logged for this date' 
                  : `${eventsForDate.length} events for this date`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-4">
                <div className="space-y-6">
                  {eventsForDate.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No events on this date</p>
                    </div>
                  ) : (
                    eventsForDate.map((event) => {
                      // Different display based on event type
                      switch (event.type) {
                        case 'symptom':
                          return (
                            <div key={event.id} className="border-l-4 border-red-400 pl-4 py-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="mb-1">
                                  {format(new Date(event.date), 'h:mm a')}
                                </Badge>
                                <Badge>{event.severity}</Badge>
                              </div>
                              <h3 className="font-medium">{event.symptomType}</h3>
                              {event.notes && <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>}
                            </div>
                          );
                        
                        case 'mood':
                          return (
                            <div key={event.id} className="border-l-4 border-blue-400 pl-4 py-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="mb-1">
                                  {format(new Date(event.date), 'h:mm a')}
                                </Badge>
                              </div>
                              <h3 className="font-medium flex items-center gap-2">
                                {event.mood === 'happy' && '😊'}
                                {event.mood === 'sad' && '😔'}
                                {event.mood === 'anxious' && '😟'}
                                {event.mood === 'calm' && '😌'}
                                {event.mood === 'irritated' && '😠'}
                                <span className="capitalize">{event.mood}</span>
                              </h3>
                              {event.notes && <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>}
                            </div>
                          );
                        
                        case 'nutrition':
                          return (
                            <div key={event.id} className="border-l-4 border-green-400 pl-4 py-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="mb-1">
                                  {format(new Date(event.date), 'h:mm a')}
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                  {event.mealType.charAt(0).toUpperCase() + event.mealType.slice(1)}
                                </Badge>
                              </div>
                              <h3 className="font-medium">Food Items:</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.foodItems.map((item: string, i: number) => (
                                  <Badge key={i} variant="outline">{item}</Badge>
                                ))}
                              </div>
                              {event.notes && <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>}
                            </div>
                          );
                          
                        case 'exercise':
                          return (
                            <div key={event.id} className="border-l-4 border-yellow-400 pl-4 py-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="mb-1">
                                  {format(new Date(event.date), 'h:mm a')}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  {event.intensity.charAt(0).toUpperCase() + event.intensity.slice(1)}
                                </Badge>
                              </div>
                              <h3 className="font-medium">{event.type}</h3>
                              <p className="text-sm">Duration: {event.duration} minutes</p>
                              {event.notes && <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>}
                            </div>
                          );
                          
                        default:
                          return null;
                      }
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Calendar;
