"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, MousePointerClick, TrendingUp, Users, Smartphone, Monitor, Tablet, ExternalLink, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  primary: "#8b5cf6",
  secondary: "#06b6d4",
  mobile: "#10b981",
  desktop: "#3b82f6",
  tablet: "#f59e0b",
  unknown: "#6b7280",
};

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [username]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/${username}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Analytics</CardTitle>
            <CardDescription>{error || "Unable to load analytics data"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(`/dashboard/${username}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { analytics } = data;

  // Prepare device data for pie chart
  const deviceData = [
    { name: "Mobile", value: analytics.deviceBreakdown.mobile.count, percentage: analytics.deviceBreakdown.mobile.percentage },
    { name: "Desktop", value: analytics.deviceBreakdown.desktop.count, percentage: analytics.deviceBreakdown.desktop.percentage },
    { name: "Tablet", value: analytics.deviceBreakdown.tablet.count, percentage: analytics.deviceBreakdown.tablet.percentage },
    { name: "Unknown", value: analytics.deviceBreakdown.unknown.count, percentage: analytics.deviceBreakdown.unknown.percentage },
  ].filter(item => item.value > 0);

  const deviceColors = {
    Mobile: COLORS.mobile,
    Desktop: COLORS.desktop,
    Tablet: COLORS.tablet,
    Unknown: COLORS.unknown,
  };

  // Format daily stats for chart
  const dailyChartData = analytics.dailyStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Views: stat.views,
    Clicks: stat.clicks,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/${username}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground">
                  Track your profile performance
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(`/${username}`, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Views */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.viewsLast30Days.toLocaleString()} in last 30 days
              </p>
            </CardContent>
          </Card>

          {/* Total Clicks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.clicksLast30Days.toLocaleString()} in last 30 days
              </p>
            </CardContent>
          </Card>

          {/* Click-Through Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.clickThroughRate}%</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalViews > 0 ? "Average engagement" : "No data yet"}
              </p>
            </CardContent>
          </Card>

          {/* Engagement Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalViews > 0 
                  ? analytics.clickThroughRate >= 75 ? "High"
                    : analytics.clickThroughRate >= 40 ? "Good"
                    : analytics.clickThroughRate >= 20 ? "Fair"
                    : "Low"
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on CTR
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Trends Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>30-Day Trend</CardTitle>
              <CardDescription>Profile views and link clicks over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Views" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.primary }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Clicks" 
                    stroke={COLORS.secondary} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.secondary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Where your audience views from</CardDescription>
            </CardHeader>
            <CardContent>
              {deviceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={deviceColors[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {deviceData.map((device) => (
                      <div key={device.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {device.name === "Mobile" && <Smartphone className="w-4 h-4" style={{ color: deviceColors[device.name] }} />}
                          {device.name === "Desktop" && <Monitor className="w-4 h-4" style={{ color: deviceColors[device.name] }} />}
                          {device.name === "Tablet" && <Tablet className="w-4 h-4" style={{ color: deviceColors[device.name] }} />}
                          <span>{device.name}</span>
                        </div>
                        <span className="font-medium">{device.value} ({device.percentage.toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No device data available yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performing Links */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
              <CardDescription>Your most clicked links</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topLinks.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topLinks.map((link, index) => (
                    <div key={link.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{link.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{link.clicks}</p>
                          <p className="text-xs text-muted-foreground">clicks</p>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${analytics.topLinks[0].clicks > 0 
                              ? (link.clicks / analytics.topLinks[0].clicks) * 100 
                              : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No link clicks yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights & Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Insights & Tips</CardTitle>
            <CardDescription>How to improve your link performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* CTR Insight */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Click-Through Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics.clickThroughRate >= 40 
                        ? "Great! Your CTR is above average. Keep creating engaging content."
                        : analytics.clickThroughRate >= 20
                        ? "Good start! Try optimizing your link titles and descriptions for better CTR."
                        : analytics.totalViews > 0
                        ? "Consider reviewing your link placement and using more compelling call-to-actions."
                        : "Start sharing your profile link to gather analytics data."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Device Insight */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Mobile Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics.deviceBreakdown.mobile.percentage >= 60
                        ? `${analytics.deviceBreakdown.mobile.percentage.toFixed(0)}% of your traffic is mobile. Your profile is mobile-optimized!`
                        : `${analytics.deviceBreakdown.desktop.percentage.toFixed(0)}% of traffic is desktop. Consider promoting on mobile platforms.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Engagement Tip */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                    <MousePointerClick className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Boost Engagement</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics.topLinks.length > 0
                        ? `"${analytics.topLinks[0].title}" is your top link. Feature it prominently!`
                        : "Add compelling links with clear descriptions to drive more clicks."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
