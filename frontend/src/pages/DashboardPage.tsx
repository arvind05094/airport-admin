import MainLayout from '../components/layout/MainLayout'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user?.email}</h1>
        <p className="text-gray-500 mt-1 text-sm">Airport Administration System</p>
      </div>
    </MainLayout>
  )
}
