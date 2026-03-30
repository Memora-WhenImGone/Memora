"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Cards from './Cards'
import { Clock3, FolderLock, Shield, Users } from 'lucide-react'
import RecentActivity from './RecentActivity'
import QuickActions from './QuickActions'

const MainHero = () => {
  const router = useRouter()
  const [vaultStatus, setVaultStatus] = useState('')
  const [vaultItemsCount, setVaultItemsCount] = useState(0)
  const [contactsCount, setContactsCount] = useState(0)
  const [triggerCount, setTriggerCount] = useState(0)
  const [activityItems, setActivityItems] = useState([])
  const [lastActivity, setLastActivity] = useState('')

  async function loadVault() {
    const v = await axios.get('/api/vault')
    const vault = v.data.vault
    if (!vault || (vault.status !== 'active' && vault.status !== 'released')) {
      router.replace('/onboarding')
      return
    }
    setVaultStatus(vault.status)
    setContactsCount(vault.contacts?.length ?? 0)
    setTriggerCount(vault.trigger ? 1 : 0)
    setLastActivity(vault.lastActiveAt ? new Date(vault.lastActiveAt).toLocaleString() : 'Not available')
  }

  async function loadItems() {
    const r = await axios.get('/api/vault/items')
    const items = r.data.items
    setVaultItemsCount(items.length)
    const recent = items.slice(0, 5).map(i => ({
      icon: 'activity',
      text: `${i.type}: ${i.title}`,
      time: new Date(i.updatedAt || i.createdAt).toLocaleString()
    }))
    setActivityItems(recent)
  }

  async function loadData() {
    try {
      await loadVault()
      await loadItems()
    } catch (e) {
      toast.error('Failed to load dashboard')
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <div className='flex flex-col p-6 bg-gray-100 min-h-screen w-screen'>
      <Header lastActivity={lastActivity} />

      
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        <Cards title="Vault Status" isStatus statusText={vaultStatus || 'Unknown'} icon={<Shield size={15} />} />
        <Cards title="Vault Items" body={vaultItemsCount} subtext="documents secured" icon={<FolderLock size={15} />} />
        <Cards title="Trusted Contacts" body={contactsCount} subtext="contacts added" icon={<Users size={15} />} />
        <Cards title="Active Triggers" body={triggerCount} subtext="configured" icon={<Clock3 size={15} />} />
      </div>

  
      <div className='flex flex-col lg:flex-row gap-4'>
        <RecentActivity items={activityItems} />
        <QuickActions />
      </div>
    </div>
  )
}

export default MainHero