
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getEmergencyContacts, deleteEmergencyContact } from "@/utils/localStorage";
import AppLayout from "@/components/Layout/AppLayout";
import EmergencyContactForm from "@/components/LoggingForm/EmergencyContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Heart, Trash2, Plus, User } from "lucide-react";
import { EmergencyContact } from "@/types";

const EmergencyContacts = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>(getEmergencyContacts());

  const handleDelete = (id: string) => {
    deleteEmergencyContact(id);
    setContacts(getEmergencyContacts());
    toast({
      title: "Contact deleted",
      description: "The emergency contact has been removed",
    });
  };

  const refreshContacts = () => {
    setContacts(getEmergencyContacts());
    setShowForm(false);
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case "doctor":
      case "physician":
      case "obgyn":
        return <User className="h-5 w-5 text-blue-500" />;
      case "husband":
      case "partner":
      case "spouse":
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <Phone className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Emergency Contacts</h1>
            <p className="text-muted-foreground">
              Store important contact information for quick access during emergencies
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="flex gap-2 items-center"
          >
            {showForm ? "Cancel" : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add Contact"}
          </Button>
        </div>

        {showForm && (
          <Card className="border-dashed border-primary/50">
            <CardHeader>
              <CardTitle className="text-xl">New Emergency Contact</CardTitle>
              <CardDescription>
                Add a new emergency contact to your list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyContactForm onSuccess={refreshContacts} />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.length === 0 && !showForm && (
            <Card className="col-span-full bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground mb-4">
                  No emergency contacts added yet
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(true)}
                >
                  Add Your First Contact
                </Button>
              </CardContent>
            </Card>
          )}

          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(contact.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getRelationshipIcon(contact.relationship)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {contact.relationship}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a 
                  href={`tel:${contact.phone}`} 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {contact.phone}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default EmergencyContacts;
