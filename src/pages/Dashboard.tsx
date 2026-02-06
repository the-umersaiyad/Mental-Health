import Quote from "@/components/Quote";
import RecentJournals from "@/components/RecentJournals";
import MoodFrequencyChart from "@/components/MoodFrequencyChart";
import DashboardMoodCalendar from "@/components/DashboardMoodCalendar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quote Section */}
        <Quote />

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Journal Entries */}
          <div className="lg:col-span-1">
            <RecentJournals />
          </div>

          {/* Mood Frequency Chart */}
          <div className="lg:col-span-1">
            <MoodFrequencyChart />
          </div>

          {/* Mood Calendar */}
          <div className="lg:col-span-1">
            <DashboardMoodCalendar />
          </div>
        </div>
      </div>
      
    </div>
  );
}
