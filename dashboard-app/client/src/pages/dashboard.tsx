import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { BarChart3, Phone, CheckCircle, XCircle, Smile, Frown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/auth";
import type { KpiData } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check authentication
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch KPI data
  const { data: kpiResponse, isLoading: kpiLoading, refetch } = useQuery<{ success: boolean; data: KpiData }>({
    queryKey: ["/api/kpi"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  useEffect(() => {
    if (!authLoading && (!authData || !authData.authenticated)) {
      setLocation("/");
    }
  }, [authData, authLoading, setLocation]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of the dashboard",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error signing out",
        variant: "destructive",
      });
    }
  };

  if (authLoading || kpiLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authData?.authenticated) {
    return null;
  }

  const kpiData = kpiResponse?.data || {
    totalCalls: 0,
    dealCalls: 0,
    noDealCalls: 0,
    positiveSentimentCalls: 0,
    negativeSentimentCalls: 0,
  };

  const calculatePercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const dealSuccessRate = calculatePercentage(kpiData.dealCalls, kpiData.totalCalls);
  const noDealRate = calculatePercentage(kpiData.noDealCalls, kpiData.totalCalls);
  const positiveSentimentRate = calculatePercentage(kpiData.positiveSentimentCalls, kpiData.totalCalls);
  const negativeSentimentRate = calculatePercentage(kpiData.negativeSentimentCalls, kpiData.totalCalls);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">KPI Dashboard</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Analytics Overview</h2>
          <p className="text-gray-600">Real-time monitoring of call performance metrics</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard
            title="Total Calls"
            value={kpiData.totalCalls.toString()}
            percentage={0}
            count={kpiData.totalCalls}
            total={kpiData.totalCalls}
            icon={<Phone />}
            color="blue"
          />

          <KpiCard
            title="Deal Success Rate"
            value={`${dealSuccessRate}%`}
            percentage={dealSuccessRate}
            count={kpiData.dealCalls}
            total={kpiData.totalCalls}
            icon={<CheckCircle />}
            color="green"
            description="deals"
          />

          <KpiCard
            title="No Deal Rate"
            value={`${noDealRate}%`}
            percentage={noDealRate}
            count={kpiData.noDealCalls}
            total={kpiData.totalCalls}
            icon={<XCircle />}
            color="red"
            description="no deals"
          />

          <KpiCard
            title="Positive Sentiment"
            value={`${positiveSentimentRate}%`}
            percentage={positiveSentimentRate}
            count={kpiData.positiveSentimentCalls}
            total={kpiData.totalCalls}
            icon={<Smile />}
            color="emerald"
            description="positive"
          />

          <KpiCard
            title="Negative Sentiment"
            value={`${negativeSentimentRate}%`}
            percentage={negativeSentimentRate}
            count={kpiData.negativeSentimentCalls}
            total={kpiData.totalCalls}
            icon={<Frown />}
            color="orange"
            description="negative"
          />
        </div>

        {/* API Endpoints Info */}
        <Card className="mt-8 bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">POST /new-call</h4>
                <p className="text-sm text-gray-600">Increments total call count</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">POST /deals</h4>
                <p className="text-sm text-gray-600">Body: {`{"deal": "Deal"}`} or {`{"deal": "No Deal"}`}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">POST /sentiment</h4>
                <p className="text-sm text-gray-600">Body: {`{"sentiment": "Positive"}`} or {`{"sentiment": "Negative"}`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
