import Image from "next/image";
import { Card, CardBody } from "@heroui/card";

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: string;
  backgroundLine: string;
  borderColor: string;
}

const StatisticCard = ({
  title,
  value,
  icon,
  backgroundLine,
  borderColor,
}: StatisticCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow relative overflow-hidden rounded-2xl">
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: borderColor }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-[120px] opacity-15 pointer-events-none">
        <Image
          src={backgroundLine}
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <CardBody className="flex flex-row items-center gap-4 pl-7 pr-6 py-6">
        <div
          className="relative w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${borderColor}20` }}
        >
          <Image src={icon} alt={title} width={36} height={36} />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-brand">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatisticCard;
