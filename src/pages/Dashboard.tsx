import Quote from "@/components/Quote";
import RecentJournals from "@/components/RecentJournals";
import MoodFrequencyChart from "@/components/MoodFrequencyChart";
import DashboardMoodCalendar from "@/components/DashboardMoodCalendar";
import Reveal from "@/components/Reveal";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quote Section */}
        <Reveal delay={0}>
          <Quote />
        </Reveal>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Journal Entries */}
          <Reveal delay={100} className="lg:col-span-1 h-full">
            <RecentJournals />
          </Reveal>

          {/* Mood Frequency Chart */}
          <Reveal delay={200} className="lg:col-span-1 h-full">
            <MoodFrequencyChart />
          </Reveal>

          {/* Mood Calendar */}
          <Reveal delay={300} className="lg:col-span-1 h-full">
            <DashboardMoodCalendar />
          </Reveal>
        </div>
      </div>
      
    </div>
  );
}
