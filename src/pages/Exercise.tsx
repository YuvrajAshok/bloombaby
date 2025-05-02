
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import { getCurrentUser, getExercises, deleteExercise } from "@/utils/localStorage";
import { Exercise as ExerciseType } from "@/types";
import ExerciseForm from "@/components/LoggingForm/ExerciseForm";
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

const Exercise = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    
    loadExercises();
  }, [navigate]);
  
  const loadExercises = () => {
    const loadedExercises = getExercises();
    setExercises(loadedExercises.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };
  
  const handleDelete = (id: string) => {
    deleteExercise(id);
    console.log("Exercise deleted:", id);
    
    toast({
      title: "Exercise deleted",
      description: "The exercise log has been removed"
    });
    
    loadExercises();
  };
  
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "light": return "bg-green-100 text-green-800";
      case "moderate": return "bg-blue-100 text-blue-800";
      case "intense": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Exercise Tracker</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Log Exercise</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log an Exercise Session</DialogTitle>
              </DialogHeader>
              <ExerciseForm 
                onSuccess={() => {
                  setDialogOpen(false);
                  loadExercises();
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {exercises.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No exercise logs yet</p>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Log Your First Exercise
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Exercise Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Intensity</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>
                    {format(new Date(exercise.date), "MMM d, yyyy - h:mm a")}
                  </TableCell>
                  <TableCell>{exercise.type}</TableCell>
                  <TableCell>{exercise.duration} min</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(exercise.intensity)}`}>
                      {exercise.intensity.charAt(0).toUpperCase() + exercise.intensity.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {exercise.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(exercise.id)}
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

export default Exercise;
