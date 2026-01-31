import { useState } from 'react';
import { Rental, MaintenanceSchedule } from '../types/rental';
import { Vehicle } from '../types/vehicle';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { 
  Calendar as CalendarIcon,
  User,
  DollarSign,
  Star,
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface RentalManagementProps {
  rentals: Rental[];
  maintenanceSchedule: MaintenanceSchedule[];
  vehicles: Vehicle[];
  onAddRental: (rental: Rental) => void;
  onAddMaintenance: (maintenance: MaintenanceSchedule) => void;
}

export function RentalManagement({ 
  rentals, 
  maintenanceSchedule, 
  vehicles,
  onAddRental,
  onAddMaintenance 
}: RentalManagementProps) {
  const [isRentalDialogOpen, setIsRentalDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [newRentalData, setNewRentalData] = useState({
    vehicleId: '',
    customerName: '',
    customerEmail: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  const [newMaintenanceData, setNewMaintenanceData] = useState({
    vehicleId: '',
    type: 'oil-change' as MaintenanceSchedule['type'],
    scheduledDate: new Date(),
    cost: 0,
    notes: '',
  });

  const handleCreateRental = () => {
    const vehicle = vehicles.find(v => v.id === newRentalData.vehicleId);
    if (!vehicle) return;

    const totalDays = Math.ceil((newRentalData.endDate.getTime() - newRentalData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const rental: Rental = {
      id: Date.now().toString(),
      vehicleId: newRentalData.vehicleId,
      customerName: newRentalData.customerName,
      customerEmail: newRentalData.customerEmail,
      startDate: newRentalData.startDate,
      endDate: newRentalData.endDate,
      totalDays,
      dailyRate: vehicle.rentalPricePerDay,
      totalCost: totalDays * vehicle.rentalPricePerDay,
      status: 'upcoming',
    };

    onAddRental(rental);
    setIsRentalDialogOpen(false);
    toast.success('Rental created successfully!', {
      description: `${vehicle.make} ${vehicle.model} booked for ${newRentalData.customerName}`,
    });
  };

  const handleScheduleMaintenance = () => {
    const vehicle = vehicles.find(v => v.id === newMaintenanceData.vehicleId);
    if (!vehicle) return;

    const maintenance: MaintenanceSchedule = {
      id: Date.now().toString(),
      vehicleId: newMaintenanceData.vehicleId,
      type: newMaintenanceData.type,
      scheduledDate: newMaintenanceData.scheduledDate,
      cost: newMaintenanceData.cost,
      status: 'scheduled',
      notes: newMaintenanceData.notes,
    };

    onAddMaintenance(maintenance);
    setIsMaintenanceDialogOpen(false);
    toast.success('Maintenance scheduled!', {
      description: `${vehicle.make} ${vehicle.model} - ${newMaintenanceData.type}`,
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const statusIcons = {
    active: CheckCircle,
    upcoming: Clock,
    completed: CheckCircle,
    scheduled: Clock,
    'in-progress': AlertCircle,
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    scheduled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'in-progress': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rentals" className="w-full">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="rentals">Active Rentals</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="rentals" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Rental Management</h3>
            <Button 
              onClick={() => setIsRentalDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Rental
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rentals.map((rental) => {
              const StatusIcon = statusIcons[rental.status];
              return (
                <Card key={rental.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-3 rounded-xl">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white">{rental.customerName}</h4>
                        <p className="text-gray-400 text-sm">{rental.customerEmail}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[rental.status]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {rental.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CalendarIcon className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-500">Vehicle</p>
                        <p className="text-sm">{getVehicleName(rental.vehicleId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm">{rental.totalDays} days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-500">Total Cost</p>
                        <p className="text-sm text-green-400">${rental.totalCost}</p>
                      </div>
                    </div>
                    {rental.rating && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="text-sm">{rental.rating}/5.0</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {rental.review && (
                    <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-gray-300 text-sm italic">"{rental.review}"</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Maintenance Schedule</h3>
            <Button 
              onClick={() => setIsMaintenanceDialogOpen(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {maintenanceSchedule.map((maintenance) => {
              const StatusIcon = statusIcons[maintenance.status];
              return (
                <Card key={maintenance.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500/20 p-3 rounded-xl">
                        <Wrench className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h4 className="text-white capitalize">{maintenance.type.replace('-', ' ')}</h4>
                        <p className="text-gray-400 text-sm">{getVehicleName(maintenance.vehicleId)}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[maintenance.status]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {maintenance.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CalendarIcon className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-500">Scheduled Date</p>
                        <p className="text-sm">{maintenance.scheduledDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <DollarSign className="w-4 h-4 text-red-400" />
                      <div>
                        <p className="text-xs text-gray-500">Estimated Cost</p>
                        <p className="text-sm text-red-400">${maintenance.cost}</p>
                      </div>
                    </div>
                    {maintenance.notes && (
                      <div className="md:col-span-1">
                        <p className="text-xs text-gray-500">Notes</p>
                        <p className="text-sm text-gray-300">{maintenance.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Rental Dialog */}
      <Dialog open={isRentalDialogOpen} onOpenChange={setIsRentalDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Rental</DialogTitle>
            <DialogDescription className="text-gray-400">
              Book a vehicle for a customer rental
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select 
                value={newRentalData.vehicleId}
                onValueChange={(value) => setNewRentalData({ ...newRentalData, vehicleId: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {vehicles.filter(v => v.status === 'available').map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - ${vehicle.rentalPricePerDay}/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={newRentalData.customerName}
                onChange={(e) => setNewRentalData({ ...newRentalData, customerName: e.target.value })}
                placeholder="John Doe"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Customer Email</Label>
              <Input
                type="email"
                value={newRentalData.customerEmail}
                onChange={(e) => setNewRentalData({ ...newRentalData, customerEmail: e.target.value })}
                placeholder="john@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newRentalData.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewRentalData({ ...newRentalData, startDate: new Date(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newRentalData.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewRentalData({ ...newRentalData, endDate: new Date(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <Button onClick={handleCreateRental} className="w-full bg-blue-600 hover:bg-blue-700">
              Create Rental
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription className="text-gray-400">
              Schedule maintenance work for a vehicle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select 
                value={newMaintenanceData.vehicleId}
                onValueChange={(value) => setNewMaintenanceData({ ...newMaintenanceData, vehicleId: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Maintenance Type</Label>
              <Select 
                value={newMaintenanceData.type}
                onValueChange={(value: MaintenanceSchedule['type']) => setNewMaintenanceData({ ...newMaintenanceData, type: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="oil-change">Oil Change</SelectItem>
                  <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                  <SelectItem value="brake-service">Brake Service</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Input
                type="date"
                value={newMaintenanceData.scheduledDate.toISOString().split('T')[0]}
                onChange={(e) => setNewMaintenanceData({ ...newMaintenanceData, scheduledDate: new Date(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated Cost ($)</Label>
              <Input
                type="number"
                value={newMaintenanceData.cost}
                onChange={(e) => setNewMaintenanceData({ ...newMaintenanceData, cost: parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                value={newMaintenanceData.notes}
                onChange={(e) => setNewMaintenanceData({ ...newMaintenanceData, notes: e.target.value })}
                placeholder="Additional notes..."
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button onClick={handleScheduleMaintenance} className="w-full bg-orange-600 hover:bg-orange-700">
              Schedule Maintenance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
