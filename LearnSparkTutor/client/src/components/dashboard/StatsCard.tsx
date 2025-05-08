import { Card, CardBody } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  trend: string;
  trendUp: boolean;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgClass,
  iconTextClass,
  trend,
  trendUp,
}: StatsCardProps) => {
  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-center">
          <h2 className="card-title">{title}</h2>
          <div className={`rounded-full ${iconBgClass} p-3`}>
            <i className={`fas ${icon} ${iconTextClass}`}></i>
          </div>
        </div>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <div className={`text-sm ${trendUp ? 'text-success' : 'text-error'} flex items-center mt-1`}>
          <i className={`fas ${trendUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> {trend}
        </div>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
