
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import { getCurrentUser, getNutrition, deleteNutrition } from "@/utils/localStorage";
import { NutritionLog } from "@/types";
import NutritionForm from "@/components/LoggingForm/NutritionForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const Nutrition = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nutrition, setNutrition] = useState<NutritionLog[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    
    loadNutrition();
  }, [navigate]);
  
  const loadNutrition = () => {
    const loadedNutrition = getNutrition();
    setNutrition(loadedNutrition.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };
  
  const handleDelete = (id: string) => {
    deleteNutrition(id);
    console.log("Nutrition log deleted:", id);
    
    toast({
      title: "Meal log deleted",
      description: "The nutrition log has been removed"
    });
    
    loadNutrition();
  };
  
  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case "breakfast": return "bg-yellow-100 text-yellow-800";
      case "lunch": return "bg-green-100 text-green-800";
      case "dinner": return "bg-blue-100 text-blue-800";
      case "snack": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Nutrition Tracker</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Log Meal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log a Meal</DialogTitle>
              </DialogHeader>
              <NutritionForm 
                onSuccess={() => {
                  setDialogOpen(false);
                  loadNutrition();
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {nutrition.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No nutrition logs yet</p>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Log Your First Meal
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Meal Type</TableHead>
                <TableHead>Food Items</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutrition.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.date), "MMM d, yyyy - h:mm a")}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(log.mealType)}`}>
                      {log.mealType.charAt(0).toUpperCase() + log.mealType.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {log.foodItems.map((item, index) => (
                        <Badge key={index} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(log.id)}
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

export default Nutrition;
