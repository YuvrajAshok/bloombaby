
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/Layout/AppLayout";
import { getCurrentUser } from "@/utils/localStorage";
import { indianHospitals, emergencyNumbers, findHospitalsNearMe, getHospitalsByDistance } from "@/utils/hospitals";
import { Hospital } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HospitalsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>(indianHospitals);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
    }
  }, [navigate]);
  
  const handleFindNearbyHospitals = async () => {
    setIsLoading(true);
    try {
      const position = await findHospitalsNearMe();
      const { latitude, longitude } = position.coords;
      
      // Get hospitals sorted by distance
      const nearbyHospitals = getHospitalsByDistance(latitude, longitude);
      setHospitals(nearbyHospitals);
      
      toast({
        title: "Location found",
        description: "Showing hospitals sorted by estimated distance",
      });
      
      console.log("Location found:", latitude, longitude);
      console.log("Hospitals sorted by distance:", nearbyHospitals);
    } catch (error) {
      console.error("Error finding location:", error);
      toast({
        title: "Location error",
        description: "Could not access your location. Please make sure location services are enabled.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openGoogleMaps = async () => {
    setIsLoading(true);
    try {
      const position = await findHospitalsNearMe();
      const { latitude, longitude } = position.coords;
      
      // Construct Google Maps URL
      const mapsUrl = `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},14z`;
      
      // Open in new window
      window.open(mapsUrl, '_blank');
      
      console.log("Opening Google Maps with coordinates:", latitude, longitude);
    } catch (error) {
      console.error("Error finding location:", error);
      toast({
        title: "Location error",
        description: "Could not access your location. Please make sure location services are enabled.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Hospital Finder</h1>
          <p className="text-muted-foreground">
            Find hospitals near you and save emergency contacts
          </p>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <Button 
            onClick={handleFindNearbyHospitals} 
            disabled={isLoading}
          >
            {isLoading ? "Finding..." : "Find Nearby Hospitals"}
          </Button>
          <Button 
            variant="outline" 
            onClick={openGoogleMaps}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Open in Google Maps"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hospitals</CardTitle>
              <CardDescription>
                {hospitals.some(h => h.distance !== undefined) 
                  ? "Hospitals sorted by distance to your location"
                  : "List of nearby hospitals"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    {hospitals.some(h => h.distance !== undefined) && (
                      <TableHead>Distance</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.address}</TableCell>
                      <TableCell>{hospital.phone}</TableCell>
                      {hospitals.some(h => h.distance !== undefined) && (
                        <TableCell>
                          {hospital.distance !== undefined ? `${hospital.distance} km` : "-"}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emergency Helplines</CardTitle>
              <CardDescription>
                Important numbers to have on hand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emergencyNumbers.map((emergency, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{emergency.name}</TableCell>
                      <TableCell className="font-bold text-primary">{emergency.number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default HospitalsPage;
