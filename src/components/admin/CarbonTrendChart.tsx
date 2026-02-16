import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CarbonHistory {
  date: string;
  carbon_saved_kg: number;
}

interface TimeSeriesPoint {
  timestamp: number;
  carbon_saved_kg: number;
}

interface Props {
  carbonSaved: number;
}

const CarbonTrendChart = ({ carbonSaved }: Props) => {
  const [data, setData] = useState<TimeSeriesPoint[]>([]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("carbon_history")
      .select("date, carbon_saved_kg")
      .order("date", { ascending: true });

    if (!error && data) {
      const formatted = data.map((item: CarbonHistory) => ({
        timestamp: new Date(item.date).getTime(),
        carbon_saved_kg: item.carbon_saved_kg
      }));

      setData(formatted);
    }
  };

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel("carbon-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "carbon_history"
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔥 Live update from backend
  useEffect(() => {
    if (!carbonSaved) return;

    const now = new Date().getTime();

    setData((prev) => {
      return [...prev, { timestamp: now, carbon_saved_kg: carbonSaved }];
    });
  }, [carbonSaved]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Carbon Savings Trend</CardTitle>
      </CardHeader>

      <CardContent style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["auto", "auto"]}
              scale="time"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString()
              }
            />

            <YAxis />

            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleString()
              }
              formatter={(value: number) =>
                `${value.toFixed(2)} kg`
              }
            />

            <Line
              type="monotone"
              dataKey="carbon_saved_kg"
              stroke="#16a34a"
              strokeWidth={3}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CarbonTrendChart;