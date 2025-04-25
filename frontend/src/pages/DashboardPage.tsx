import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../lib/api'

interface Stats {
  totalUsers: number
  pendingLeaves: number
  pendingShiftCover: number
  pendingStaffingRequests: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (user?.role !== 'Admin') return
    Promise.all([
      api.get('/api/admin/users'),
      api.get('/api/admin/leaves'),
      api.get('/api/admin/shift-cover'),
      api.get('/api/admin/staffing-requests'),
    ]).then(([users, leaves, shiftCover, staffing]) => {
      setStats({
        totalUsers: users.data.length,
        pendingLeaves: leaves.data.filter((l: any) => l.status === 'Pending').length,
        pendingShiftCover: shiftCover.data.filter((s: any) => s.status === 'Pending').length,
        pendingStaffingRequests: staffing.data.filter((s: any) => s.status === 'Pending').length,
      })
    })
  }, [user])

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">Welcome back, {user?.email}</p>

      {user?.role === 'Admin' && stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Pending Leaves" value={stats.pendingLeaves} />
          <StatCard label="Pending Shift Cover" value={stats.pendingShiftCover} />
          <StatCard label="Pending Staffing" value={stats.pendingStaffingRequests} />
        </div>
      )}

      {user?.role !== 'Admin' && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <QuickLink label="My Leaves" href="/my/leaves" description="View and manage your leave requests" />
          <QuickLink label="My Shift Cover" href="/my/shift-cover" description="View and manage shift cover requests" />
          <QuickLink label="My Roster" href="/my/roster" description="View your assigned shifts" />
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
    </div>
  )
}

function QuickLink({ label, href, description }: { label: string; href: string; description: string }) {
  return (
    <a href={href} className="border border-gray-200 rounded-lg p-5 bg-white hover:border-black transition block">
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </a>
  )
}
