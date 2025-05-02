
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/Layout/AppLayout";
import AppointmentForm from "@/components/LoggingForm/AppointmentForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAppointments, deleteAppointment } from "@/utils/localStorage";
import { Appointment } from "@/types";
import { format, isPast, isTomorrow, isToday, addDays, isSameDay } from "date-fns";
import { Calendar, Clock, MapPin, Trash2, Bell, Plus, FileText } from "lucide-react";

const Appointments = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const allAppointments = getAppointments();
    setAppointments(allAppointments.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    loadAppointments();
    toast({
      title: "Appointment deleted",
      description: "The appointment has been removed",
    });
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAppointment(null);
    loadAppointments();
  };

  // Group appointments by date category (today, tomorrow, upcoming, past)
  const groupedAppointments = {
    today: appointments.filter(app => isToday(new Date(app.date))),
    tomorrow: appointments.filter(app => isTomorrow(new Date(app.date))),
    upcoming: appointments.filter(app => {
      const appDate = new Date(app.date);
      return !isToday(appDate) && 
             !isTomorrow(appDate) && 
             !isPast(appDate);
    }),
    thisWeek: appointments.filter(app => {
      const appDate = new Date(app.date);
      const now = new Date();
      const endOfWeek = addDays(now, 7);
      return !isToday(appDate) && 
             !isTomorrow(appDate) && 
             appDate > now && 
             appDate <= endOfWeek;
    }),
    past: appointments.filter(app => {
      const appDate = new Date(app.date);
      return isPast(appDate) && !isToday(appDate);
    }).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime() // Sort past in reverse
    ),
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id} className="overflow-hidden group">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(appointment.id)}
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start pr-8">
          <div>
            <CardTitle className="text-lg">{appointment.title}</CardTitle>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <CardDescription>
                {format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </div>
          </div>
          {appointment.reminder && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              <span>Reminder</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.time}</span>
          </div>
          
          {appointment.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.location}</span>
            </div>
          )}
          
          {appointment.notes && (
            <div className="flex items-start gap-2 pt-1">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">{appointment.notes}</span>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4 w-full"
          onClick={() => handleEdit(appointment)}
        >
          Edit Appointment
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Appointments</h1>
            <p className="text-muted-foreground">
              Schedule and manage your prenatal appointments and check-ups
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingAppointment(null);
            }}
            className="flex gap-2 items-center"
          >
            {showForm ? "Cancel" : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add Appointment"}
          </Button>
        </div>

        {showForm && (
          <Card className="border-dashed border-primary/50">
            <CardHeader>
              <CardTitle className="text-xl">
                {editingAppointment ? "Edit Appointment" : "New Appointment"}
              </CardTitle>
              <CardDescription>
                {editingAppointment
                  ? "Update the appointment details"
                  : "Schedule a new appointment or check-up"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentForm 
                onSuccess={handleFormSuccess} 
                existingAppointment={editingAppointment}
              />
            </CardContent>
          </Card>
        )}

        {appointments.length === 0 && !showForm && (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                No appointments scheduled
              </p>
              <Button variant="outline" onClick={() => setShowForm(true)}>
                Schedule Your First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
        
        {groupedAppointments.today.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold">Today</h2>
              <Badge variant="secondary">
                {groupedAppointments.today.length} appointment
                {groupedAppointments.today.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedAppointments.today.map(renderAppointmentCard)}
            </div>
          </div>
        )}

        {groupedAppointments.tomorrow.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold">Tomorrow</h2>
              <Badge variant="secondary">
                {groupedAppointments.tomorrow.length} appointment
                {groupedAppointments.tomorrow.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedAppointments.tomorrow.map(renderAppointmentCard)}
            </div>
          </div>
        )}

        {groupedAppointments.thisWeek.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold">This Week</h2>
              <Badge variant="secondary">
                {groupedAppointments.thisWeek.length} appointment
                {groupedAppointments.thisWeek.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedAppointments.thisWeek.map(renderAppointmentCard)}
            </div>
          </div>
        )}

        {groupedAppointments.upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold">Upcoming</h2>
              <Badge variant="secondary">
                {groupedAppointments.upcoming.length} appointment
                {groupedAppointments.upcoming.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedAppointments.upcoming.map(renderAppointmentCard)}
            </div>
          </div>
        )}

        {groupedAppointments.past.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold text-muted-foreground">Past</h2>
              <Badge variant="outline">
                {groupedAppointments.past.length} appointment
                {groupedAppointments.past.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedAppointments.past.slice(0, 4).map(renderAppointmentCard)}
            </div>
            {groupedAppointments.past.length > 4 && (
              <Button 
                variant="ghost" 
                className="w-full mt-2"
                onClick={() => toast({
                  title: "Feature coming soon",
                  description: "View all past appointments functionality will be added soon",
                })}
              >
                View all past appointments
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Appointments;
