import React, { useEffect, useRef } from "react";
import Quote from "@/components/Quote";
import RecentJournals from "@/components/RecentJournals";
import MoodFrequencyChart from "@/components/MoodFrequencyChart";
import DashboardMoodCalendar from "@/components/DashboardMoodCalendar";
import anime from "animejs";

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: '.dashboard-stagger-item',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(150, {start: 100}),
        easing: 'easeOutSpring(1, 80, 10, 0)',
        duration: 800
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-6" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quote Section */}
        <div className="dashboard-stagger-item opacity-0">
          <Quote />
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Journal Entries */}
          <div className="lg:col-span-1 dashboard-stagger-item opacity-0">
            <RecentJournals />
          </div>

          {/* Mood Frequency Chart */}
          <div className="lg:col-span-1 dashboard-stagger-item opacity-0">
            <MoodFrequencyChart />
          </div>

          {/* Mood Calendar */}
          <div className="lg:col-span-1 dashboard-stagger-item opacity-0">
            <DashboardMoodCalendar />
          </div>
        </div>
      </div>
      
    </div>
  );
}
