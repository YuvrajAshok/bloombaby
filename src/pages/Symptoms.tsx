
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import { getCurrentUser, getSymptoms, deleteSymptom } from "@/utils/localStorage";
import { Symptom } from "@/types";
import SymptomForm from "@/components/LoggingForm/SymptomForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Symptoms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    
    loadSymptoms();
  }, [navigate]);
  
  const loadSymptoms = () => {
    const loadedSymptoms = getSymptoms();
    setSymptoms(loadedSymptoms.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };
  
  const handleDelete = (id: string) => {
    deleteSymptom(id);
    console.log("Symptom deleted:", id);
    
    toast({
      title: "Symptom deleted",
      description: "The symptom log has been removed"
    });
    
    loadSymptoms();
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Symptoms</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Log New Symptom</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex flex-row justify-between items-center">
                <DialogTitle>Log a Symptom</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </DialogHeader>
              <SymptomForm 
                onComplete={() => {
                  setDialogOpen(false);
                  loadSymptoms();
                }}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {symptoms.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No symptoms logged yet</p>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Log Your First Symptom
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Symptom</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {symptoms.map((symptom) => (
                <TableRow key={symptom.id}>
                  <TableCell>
                    {format(new Date(symptom.date), "MMM d, yyyy - h:mm a")}
                  </TableCell>
                  <TableCell>{symptom.symptomType}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                      {symptom.severity}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {symptom.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(symptom.id)}
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

export default Symptoms;
