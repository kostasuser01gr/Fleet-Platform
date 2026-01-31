// Request History Component - Shows past requests with filtering and reporting

import { useState, useMemo } from 'react';
import type { PartsRequest } from '../../types/partsRadar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface RequestHistoryProps {
  requests: PartsRequest[];
  onViewRequest?: (request: PartsRequest) => void;
  onExport?: () => void;
}

export function RequestHistory({ requests, onViewRequest, onExport }: RequestHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch = 
        req.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.vehicleIds.some((id) => id.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const now = new Date();
        const reqDate = new Date(req.createdAt);
        const daysDiff = Math.floor((now.getTime() - reqDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [requests, searchQuery, statusFilter, dateFilter]);

  const getStatusIcon = (status: PartsRequest['status']) => {
    switch (status) {
      case 'closed':
      case 'received':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: PartsRequest['status']) => {
    switch (status) {
      case 'closed':
      case 'received':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      case 'approved':
      case 'ordered':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Request History</h3>
          <p className="text-xs text-gray-400">{filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}</p>
        </div>
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-700 text-white text-sm h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800/50 border-gray-700">
              <TableHead className="text-gray-300 text-xs">ID</TableHead>
              <TableHead className="text-gray-300 text-xs">Mode</TableHead>
              <TableHead className="text-gray-300 text-xs">Vehicles</TableHead>
              <TableHead className="text-gray-300 text-xs">Parts</TableHead>
              <TableHead className="text-gray-300 text-xs">Status</TableHead>
              <TableHead className="text-gray-300 text-xs">Created</TableHead>
              <TableHead className="text-gray-300 text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.requestId} className="border-gray-700 hover:bg-gray-800/30">
                  <TableCell className="text-white text-xs font-mono">
                    {request.requestId.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {request.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 text-xs">
                    {request.vehicleIds.length}
                  </TableCell>
                  <TableCell className="text-gray-300 text-xs">
                    {request.partLines.length}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      <Badge className={`${getStatusColor(request.status)} text-xs`}>
                        {request.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 text-xs">
                    {format(new Date(request.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {onViewRequest && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewRequest(request)}
                        className="h-7 px-2 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
