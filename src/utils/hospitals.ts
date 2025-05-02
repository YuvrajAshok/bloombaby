
import { Hospital } from "@/types";

export const indianHospitals: Hospital[] = [
  {
    id: "h1",
    name: "Apollo Hospital",
    address: "New Delhi, Delhi",
    phone: "011-2687-6543"
  },
  {
    id: "h2",
    name: "Fortis Hospital",
    address: "Gurugram, Haryana",
    phone: "0124-4921-021"
  },
  {
    id: "h3",
    name: "AIIMS Hospital",
    address: "New Delhi, Delhi",
    phone: "011-2658-8500"
  },
  {
    id: "h4",
    name: "Max Super Speciality Hospital",
    address: "Saket, New Delhi",
    phone: "011-2651-5050"
  },
  {
    id: "h5",
    name: "Lilavati Hospital",
    address: "Bandra West, Mumbai",
    phone: "022-2675-1000"
  },
  {
    id: "h6",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    address: "Andheri West, Mumbai",
    phone: "022-3099-9999"
  },
  {
    id: "h7",
    name: "Narayana Health",
    address: "Bommasandra, Bangalore",
    phone: "080-2783-2777"
  },
  {
    id: "h8",
    name: "Apollo Hospital",
    address: "Greams Road, Chennai",
    phone: "044-2829-3333"
  },
  {
    id: "h9",
    name: "Manipal Hospital",
    address: "HAL Airport Road, Bangalore",
    phone: "080-2502-4444"
  },
  {
    id: "h10",
    name: "Medanta - The Medicity",
    address: "Gurugram, Haryana",
    phone: "0124-4141-414"
  }
];

export const emergencyNumbers = [
  { name: "National Emergency Number", number: "112" },
  { name: "Ambulance", number: "108" },
  { name: "Women Helpline", number: "1091" },
  { name: "Child Helpline", number: "1098" }
];

export const getHospitalsByDistance = (lat: number, lng: number): Hospital[] => {
  // In a real app, we'd calculate actual distances to each hospital
  // For demo purposes, we're just assigning random distances
  return indianHospitals.map(hospital => ({
    ...hospital,
    distance: Math.round(Math.random() * 20) // Random distance 0-20km
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

export const findHospitalsNearMe = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
