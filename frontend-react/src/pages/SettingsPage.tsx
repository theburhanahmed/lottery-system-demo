import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService, ChangePasswordData } from '../services/user.service'
import { Button } from '../components/ui/Button'
import { 
  Lock, Shield, Bell, Download, Trash2, ArrowLeft, Loader2,
  Eye, EyeOff, AlertTriangle, CheckCircle, User, Clock
} from 'lucide-react'

export function SettingsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'security' | 'limits' | 'data'>('security')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const [limits, setLimits] = useState({
    daily_deposit_limit: '',
    weekly_deposit_limit: '',
    monthly_deposit_limit: '',
  })

  const [selfExcludeDays, setSelfExcludeDays] = useState<string>('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  useEffect(() => {
    fetchResponsibleGamingStatus()
  }, [])

  const fetchResponsibleGamingStatus = async () => {
    try {
      const status = await userService.getResponsibleGamingStatus()
      setLimits({
        daily_deposit_limit: status.daily_deposit_limit || '',
        weekly_deposit_limit: status.weekly_deposit_limit || '',
        monthly_deposit_limit: status.monthly_deposit_limit || '',
      })
    } catch (err) {
      console.error('Failed to fetch gaming status:', err)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setError('New passwords do not match')
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      await userService.changePassword(passwordData)
      setSuccessMessage('Password changed successfully!')
      setPasswordData({ old_password: '', new_password: '', confirm_new_password: '' })
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveLimits = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await userService.setDepositLimits({
        daily_deposit_limit: limits.daily_deposit_limit || null,
        weekly_deposit_limit: limits.weekly_deposit_limit || null,
        monthly_deposit_limit: limits.monthly_deposit_limit || null,
      })
      setSuccessMessage('Deposit limits updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update limits')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelfExclude = async () => {
    if (!selfExcludeDays) {
      setError('Please enter the number of days')
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      await userService.selfExclude(parseInt(selfExcludeDays))
      setSuccessMessage(`Self-exclusion applied for ${selfExcludeDays} days`)
      setSelfExcludeDays('')
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to apply self-exclusion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async (format: 'json' | 'csv') => {
    try {
      setIsLoading(true)
      const data = await userService.exportData(format)
      const blob = new Blob([format === 'json' ? JSON.stringify(data, null, 2) : data], {
        type: format === 'json' ? 'application/json' : 'text/csv',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `my_data.${format}`
      a.click()
      URL.revokeObjectURL(url)
      setSuccessMessage('Data exported successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to export data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }
    
    try {
      setIsLoading(true)
      await userService.deleteAccount('DELETE')
      logout()
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to delete account')
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'limits', label: 'Responsible Gaming', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Download },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center space-x-4">
          <Link to="/profile" className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 px-4 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-gold-500 text-brand-gold-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mx-auto mb-1" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.old ? 'text' : 'password'}
                          value={passwordData.old_password}
                          onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirm_new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_new_password: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                      Change Password
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'limits' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Deposit Limits</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Set limits on how much you can deposit to help manage your spending.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Daily Limit ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={limits.daily_deposit_limit}
                        onChange={(e) => setLimits({ ...limits, daily_deposit_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Weekly Limit ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={limits.weekly_deposit_limit}
                        onChange={(e) => setLimits({ ...limits, weekly_deposit_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Monthly Limit ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={limits.monthly_deposit_limit}
                        onChange={(e) => setLimits({ ...limits, monthly_deposit_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveLimits} disabled={isLoading} className="mt-4">
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Save Limits
                  </Button>
                </div>

                <div className="border-t border-slate-200 pt-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Self-Exclusion</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Take a break from the platform. During self-exclusion, you won't be able to log in or participate.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">This action cannot be undone</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Once you self-exclude, you will not be able to access your account until the exclusion period ends.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 max-w-md">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Exclusion Period (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={selfExcludeDays}
                        onChange={(e) => setSelfExcludeDays(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent"
                        placeholder="e.g., 30"
                      />
                    </div>
                    <Button variant="outline" onClick={handleSelfExclude} disabled={isLoading} className="mt-6">
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                      Self-Exclude
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Export Your Data</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Download a copy of all your personal data stored on our platform.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => handleExportData('json')} disabled={isLoading}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as JSON
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('csv')} disabled={isLoading}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-8">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="border-red-300 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Account
                    </Button>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                      <p className="text-sm text-red-800 font-medium mb-3">
                        Type "DELETE" to confirm account deletion
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                        placeholder="Type DELETE"
                      />
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleDeleteAccount} 
                          disabled={isLoading || deleteConfirmation !== 'DELETE'}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                          Permanently Delete
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteConfirmation('')
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
