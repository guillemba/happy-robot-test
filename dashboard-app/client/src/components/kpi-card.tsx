import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string;
  percentage: number;
  count: number;
  total: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "emerald" | "orange";
  description?: string;
}

const colorClasses = {
  blue: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    progressColor: "bg-blue-600",
  },
  green: {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    progressColor: "bg-green-600",
  },
  red: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    progressColor: "bg-red-600",
  },
  emerald: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    progressColor: "bg-emerald-600",
  },
  orange: {
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    progressColor: "bg-orange-600",
  },
};

export function KpiCard({
  title,
  value,
  percentage,
  count,
  total,
  icon,
  color,
  description,
}: KpiCardProps) {
  const colors = colorClasses[color];

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`h-12 w-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
            <div className={`h-6 w-6 ${colors.iconColor}`}>
              {icon}
            </div>
          </div>
        </div>
        {title !== "Total Calls" && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`${colors.progressColor} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{count}</span> {description} out of{" "}
              <span className="font-medium">{total}</span> calls
            </div>
          </>
        )}
        {title === "Total Calls" && (
          <div className="text-sm text-gray-500">
            <span className="text-green-600 font-medium">Base metric</span> for all calculations
          </div>
        )}
      </CardContent>
    </Card>
  );
}
