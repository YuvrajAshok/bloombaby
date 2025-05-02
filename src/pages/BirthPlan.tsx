
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import { getCurrentUser, getBirthPlan, deleteBirthPlanItem } from "@/utils/localStorage";
import { BirthPlanItem } from "@/types";
import BirthPlanForm from "@/components/LoggingForm/BirthPlanForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const BirthPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [birthPlan, setBirthPlan] = useState<BirthPlanItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    
    loadBirthPlan();
  }, [navigate]);
  
  const loadBirthPlan = () => {
    const loadedBirthPlan = getBirthPlan();
    // Group by category for display
    setBirthPlan(loadedBirthPlan);
  };
  
  const handleDelete = (id: string) => {
    deleteBirthPlanItem(id);
    console.log("Birth plan item deleted:", id);
    
    toast({
      title: "Item deleted",
      description: "The birth plan item has been removed"
    });
    
    loadBirthPlan();
  };
  
  const groupedBirthPlan = birthPlan.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BirthPlanItem[]>);
  
  const categoryLabels: Record<string, string> = {
    "environment": "Birth Environment",
    "procedures": "Medical Procedures",
    "support": "Support Team",
    "pain management": "Pain Management",
    "postpartum": "Postpartum"
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Birth Plan</h1>
            <p className="text-muted-foreground">
              Document your preferences for your delivery day
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Preference</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Birth Plan Preference</DialogTitle>
              </DialogHeader>
              <BirthPlanForm 
                onSuccess={() => {
                  setDialogOpen(false);
                  loadBirthPlan();
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {birthPlan.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">Your birth plan is empty</p>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Start Your Birth Plan
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBirthPlan).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{categoryLabels[category] || category}</CardTitle>
                  <CardDescription>
                    Your preferences for {categoryLabels[category]?.toLowerCase() || category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Preference</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.preference}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.notes || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BirthPlan;
