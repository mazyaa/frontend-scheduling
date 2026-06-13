"use client";

import type { ISertifikatPerBulan } from "@/types/dashboard";

import { Card, CardBody } from "@heroui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MonthlyCertificateChartProps {
  data: ISertifikatPerBulan[];
}

const BAR_COLORS = [
  "#6366f1",
  "#f472b6",
  "#38bdf8",
  "#fb923c",
  "#a3e635",
  "#4ade80",
  "#c084fc",
  "#22d3ee",
  "#3b82f6",
  "#facc15",
  "#2dd4bf",
  "#a78bfa",
];

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-500">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const MonthlyCertificateChart = ({ data }: MonthlyCertificateChartProps) => {
  const chartData = data.map((item) => ({
    name: item.bulan.slice(0, 3),
    value: item.total,
  }));

  return (
    <div className="bg-gray-100 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-brand">
        PENERBITAN E-SERTIFIKAT PERBULAN
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-5">
        Total Penerbitan E-Sertifikat perbulan
      </p>
      <Card className="shadow-sm">
        <CardBody className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart barSize={32} data={chartData}>
                <CartesianGrid
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  axisLine={{ stroke: "#e5e7eb" }}
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  formatter={(value: any) => [value ?? 0, "Total"]}
                />
                <Legend content={<CustomLegend />} />
                <Bar
                  dataKey="value"
                  label={{
                    position: "top",
                    fontSize: 11,
                    fill: "#6b7280",
                    formatter: (v: any) => v,
                  }}
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MonthlyCertificateChart;
