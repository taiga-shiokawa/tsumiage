import { useEffect, useState } from 'react';
import { supabase } from '../../libs/supabaseClient';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';

// 日付ユーティリティ
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};
const startOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
};

// カスタムツールチップ
const CustomTooltip = ({ active, payload }: TooltipProps<number | string, string>) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: 8 }}>
        {payload[0].name}
      </div>
    );
  }
  return null;
};

export const Report = () => {
  const [todayData, setTodayData] = useState<{ name: string; value: number }[]>([]);
  const [weekData, setWeekData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      // ユーザー取得
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 今日のタスク数 → 今日のタスクごとの作業時間
      const { data: todos, error: todoErr } = await supabase
        .from('todos')
        .select('id, title, started_at, ended_at')
        .gte('created_at', startOfToday());
      if (todoErr) console.error(todoErr);
      else {
        type TodayTodo = { title: string; started_at: string | null; ended_at: string | null };
        const arr = ((todos as TodayTodo[]) || []).map((t) => {
          let value = 0;
          if (t.started_at && t.ended_at) {
            value = (new Date(t.ended_at).getTime() - new Date(t.started_at).getTime()) / 1000 / 60; // 分単位
            value = Math.max(value, 0.1); // 0分は0.1分にして見えるように
          }
          return { name: t.title, value };
        }).filter(t => t.value > 0);
        setTodayData(arr);
      }

      // 今週の総学習時間
      const { data: logs, error: logErr } = await supabase
        .from('todos')
        .select('started_at, ended_at')
        .gte('started_at', startOfWeek());
      if (logErr) console.error(logErr);
      else {
        let totalMs = 0;
        type Log = { started_at: string | null; ended_at: string | null };
        (logs as Log[] | undefined)?.forEach((t) => {
          if (t.started_at && t.ended_at) {
            totalMs += new Date(t.ended_at).getTime() - new Date(t.started_at).getTime();
          }
        });
        const hours = totalMs / 1000 / 60 / 60;
        setWeekData([{ name: '今週の合計時間 (h)', value: parseFloat(hours.toFixed(2)) }]);
      }
    };
    fetchReport();
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      {/* 今日の積み上げ */}
      <div className="border rounded p-4">
        <h3 className="text-xl font-bold mb-4">今日の積み上げ</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={todayData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={false}
            >
              {todayData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 今週の積み上げ */}
      <div className="border rounded p-4">
        <h3 className="text-xl font-bold mb-4">今週の積み上げ</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={weekData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={false}
            >
              {weekData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[0]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} h`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
