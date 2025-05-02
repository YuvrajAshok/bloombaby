
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import { getCurrentUser, getMoods, deleteMood } from "@/utils/localStorage";
import { Mood as MoodType } from "@/types";
import MoodForm from "@/components/LoggingForm/MoodForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Mood = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [moods, setMoods] = useState<MoodType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    
    loadMoods();
  }, [navigate]);
  
  const loadMoods = () => {
    const loadedMoods = getMoods();
    setMoods(loadedMoods.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };
  
  const handleDelete = (id: string) => {
    deleteMood(id);
    console.log("Mood deleted:", id);
    
    toast({
      title: "Mood deleted",
      description: "The mood log has been removed"
    });
    
    loadMoods();
  };
  
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😔";
      case "anxious": return "😟";
      case "calm": return "😌";
      case "irritated": return "😠";
      default: return "😐";
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Mood Tracker</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Log Mood</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log Your Current Mood</DialogTitle>
              </DialogHeader>
              <MoodForm 
                onSuccess={() => {
                  setDialogOpen(false);
                  loadMoods();
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {moods.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No mood logs yet</p>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Record Your First Mood
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Mood</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moods.map((mood) => (
                <TableRow key={mood.id}>
                  <TableCell>
                    {format(new Date(mood.date), "MMM d, yyyy - h:mm a")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getMoodEmoji(mood.mood)}</span>
                      <span className="capitalize">{mood.mood}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {mood.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(mood.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AppLayout>
  );
};

export default Mood;
