import React, { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  History,
  Filter,
  Clock3,
  Table2,
  Coffee,
  RefreshCcw,
  ChevronDown,
  X,
  Eye,
  Sparkles,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Flame,
  BadgeCheck,
  Package,
  Bell,
} from 'lucide-react'

const STORAGE_KEY = 'brewbite_admin_orders_v1'
const USER_STORAGE_KEY = 'brewbite_history'
const THEME_KEY = 'brewbite_admin_theme'
const REMOTE_ORDERS_URL = import.meta.env.VITE_BREWBITE_ORDERS_API_URL || ''
const STATUS_ORDER = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served']
const TAB_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'active', label: 'Live Orders', icon: ClipboardList },
  { id: 'history', label: 'Past Orders', icon: History },
]

const statusMeta = {
  Pending: { className: 'pending', icon: Clock3, label: 'Pending' },
  Accepted: { className: 'accepted', icon: CheckCircle2, label: 'Accepted' },
  Preparing: { className: 'preparing', icon: Flame, label: 'Preparing' },
  Ready: { className: 'ready', icon: BadgeCheck, label: 'Ready' },
  Served: { className: 'served', icon: Package, label: 'Served' },
}

const seedOrders = [
  {
    id: 'BB-1042',
    tableNumber: 5,
    type: 'Dine-In',
    status: 'Pending',
    createdAt: nowMinus(9),
    total: 352,
    specialInstructions: 'Less ice on latte, add extra sugar packets.',
    items: [
      { name: 'Latte', quantity: 1, price: 200, customizations: 'Tall, No foam' },
      { name: 'Espresso', quantity: 1, price: 152, customizations: 'Double shot, Strong' },
    ],
  },
  {
    id: 'BB-1041',
    tableNumber: 4,
    type: 'Takeaway',
    status: 'Preparing',
    createdAt: nowMinus(22),
    total: 280,
    specialInstructions: 'Pack separately.',
    items: [{ name: 'Chicken Burger', quantity: 1, price: 280, customizations: 'Extra spicy' }],
  },
  {
    id: 'BB-1040',
    tableNumber: 8,
    type: 'Dine-In',
    status: 'Ready',
    createdAt: nowMinus(34),
    total: 620,
    specialInstructions: 'Serve with warm napkins.',
    items: [
      { name: 'Veg Pizza', quantity: 1, price: 250, customizations: 'Medium, Thin crust' },
      { name: 'Mango Smoothie', quantity: 2, price: 185, customizations: 'No ice' },
    ],
  },
  {
    id: 'BB-1039',
    tableNumber: 2,
    type: 'Dine-In',
    status: 'Served',
    createdAt: nowMinus(220),
    total: 460,
    specialInstructions: 'No onions.',
    items: [
      { name: 'Veg Sandwich', quantity: 1, price: 200, customizations: 'Grilled' },
      { name: 'Cold Brew', quantity: 1, price: 260, customizations: 'Venti' },
    ],
  },
  {
    id: 'BB-1038',
    tableNumber: 12,
    type: 'Takeaway',
    status: 'Accepted',
    createdAt: nowMinus(48),
    total: 210,
    specialInstructions: 'Double bag it.',
    items: [{ name: 'Cappuccino', quantity: 1, price: 210, customizations: 'Short, Extra foam' }],
  },
  {
    id: 'BB-1037',
    tableNumber: 1,
    type: 'Dine-In',
    status: 'Served',
    createdAt: nowMinus(320),
    total: 540,
    specialInstructions: 'Birthday order.',
    items: [
      { name: 'Chocolate Cake', quantity: 1, price: 240, customizations: 'Chilled' },
      { name: 'Hot Coffee', quantity: 2, price: 150, customizations: 'Less sugar' },
    ],
  },
  {
    id: 'BB-1036',
    tableNumber: 7,
    type: 'Dine-In',
    status: 'Ready',
    createdAt: nowMinus(405),
    total: 390,
    specialInstructions: 'Extra tissue.',
    items: [{ name: 'French Fries', quantity: 2, price: 195, customizations: 'Extra crispy' }],
  },
  {
    id: 'BB-1035',
    tableNumber: 6,
    type: 'Takeaway',
    status: 'Served',
    createdAt: nowMinus(560),
    total: 150,
    specialInstructions: 'Quick pickup.',
    items: [{ name: 'Iced Coffee', quantity: 1, price: 150, customizations: 'No sugar' }],
  },
  {
    id: 'BB-1034',
    tableNumber: 5,
    type: 'Dine-In',
    status: 'Preparing',
    createdAt: nowMinus(610),
    total: 430,
    specialInstructions: 'Serve together.',
    items: [
      { name: 'Waffles', quantity: 1, price: 180, customizations: 'Chocolate topping' },
      { name: 'Latte', quantity: 1, price: 250, customizations: 'Venti' },
    ],
  },
  {
    id: 'BB-1033',
    tableNumber: 3,
    type: 'Dine-In',
    status: 'Served',
    createdAt: nowMinus(1200),
    total: 690,
    specialInstructions: 'Family table.',
    items: [
      { name: 'Chicken Pizza', quantity: 1, price: 320, customizations: 'Large, Thin crust' },
      { name: 'Brownie Sundae', quantity: 2, price: 185, customizations: 'Extra chocolate' },
    ],
  },
]

function nowMinus(minutes) {
  return Date.now() - minutes * 60 * 1000
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatTimeOnly(value) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatDayLabel(value) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`
}

function sameDay(left, right) {
  const a = new Date(left)
  const b = new Date(right)
  return a.toDateString() === b.toDateString()
}

function statusIndex(status) {
  return STATUS_ORDER.indexOf(status)
}

function getAverageWaitMinutes(orders, now) {
  const active = orders.filter((order) => order.status !== 'Served')
  if (active.length === 0) return 0
  const total = active.reduce((sum, order) => sum + Math.max(0, (now - order.createdAt) / 60000), 0)
  return total / active.length
}

function groupByTable(orders) {
  const map = new Map()
  orders.forEach((order) => {
    const key = order.type === 'Takeaway' ? 'Takeaway' : `Table ${order.tableNumber}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(order)
  })
  return Array.from(map.entries()).map(([title, list]) => ({ title, list }))
}

function groupByDate(orders) {
  const map = new Map()
  orders.forEach((order) => {
    const key = new Date(order.createdAt).toDateString()
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(order)
  })
  return Array.from(map.entries())
    .map(([dateKey, list]) => ({ dateKey, list: list.sort((a, b) => b.createdAt - a.createdAt) }))
    .sort((a, b) => new Date(b.dateKey) - new Date(a.dateKey))
}

function normalizeUserStatus(status) {
  if (!status || status === 'Rejected') return 'Pending'
  return STATUS_ORDER.includes(status) ? status : 'Pending'
}

function mapUserOrderToAdmin(order) {
  const items = Array.isArray(order.items) ? order.items : []
  const createdAt = Number(order.timestamp) || Date.now()
  const parsedTable = Number(order.table || 0)
  const isDineIn = order.mode === 'Dine-In' && parsedTable > 0
  const tableNumber = isDineIn ? parsedTable : 0
  const type = isDineIn ? 'Dine-In' : 'Takeaway'
  const safeId = String(order.id || `BB-${Math.floor(Math.random() * 100000)}`)
  const total = Number(order.total) || items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)

  return {
    id: safeId,
    tableNumber,
    type,
    status: normalizeUserStatus(order.status),
    createdAt,
    total,
    specialInstructions: items.map((item) => item.instructions).filter(Boolean).join(' | ') || 'Imported from BrewBite user orders',
    items: items.map((item) => ({
      name: item.name || 'Item',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      customizations: [item.variantName, item.prepOption].filter(Boolean).join(' • ') || 'Standard preparation',
    })),
    source: 'customer-app',
  }
}

function normalizeIncomingOrder(order) {
  if (!order || typeof order !== 'object') return null

  // If the object already matches admin shape, normalize minimal fields only.
  if (order.createdAt && order.status && Array.isArray(order.items)) {
    return {
      ...order,
      id: String(order.id || `BB-${Math.floor(Math.random() * 100000)}`),
      createdAt: Number(order.createdAt) || Date.now(),
      status: normalizeUserStatus(order.status),
      source: order.source || 'remote-feed',
    }
  }

  // Fallback to user-app payload mapping (timestamp/mode/table structure).
  return {
    ...mapUserOrderToAdmin(order),
    source: 'remote-feed',
  }
}

function normalizeRemoteOrdersPayload(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.orders)
      ? payload.orders
      : []

  return list
    .map((order) => normalizeIncomingOrder(order))
    .filter(Boolean)
}

function loadUserOrders() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return []
    return parsed.map(mapUserOrderToAdmin)
  } catch {
    return []
  }
}

function mergeOrderSources(adminOrders, userOrders) {
  const byId = new Map()

  adminOrders.forEach((order) => {
    byId.set(String(order.id), order)
  })

  userOrders.forEach((order) => {
    const key = String(order.id)
    const existing = byId.get(key)
    if (!existing || (existing.source === 'customer-app' && order.createdAt >= existing.createdAt)) {
      byId.set(key, order)
      return
    }

    byId.set(key, {
      ...existing,
      status: order.status,
      items: order.items,
      total: order.total,
      tableNumber: order.tableNumber,
      type: order.type,
      source: existing.source || 'admin',
    })
  })

  return Array.from(byId.values())
}

function loadOrders() {
  if (typeof window === 'undefined') return seedOrders
  const raw = window.localStorage.getItem(STORAGE_KEY)
  const userOrders = loadUserOrders()
  if (!raw) return mergeOrderSources(seedOrders, userOrders)
  try {
    const parsed = JSON.parse(raw)
    const adminOrders = Array.isArray(parsed) && parsed.length ? parsed : seedOrders
    return mergeOrderSources(adminOrders, userOrders)
  } catch {
    return mergeOrderSources(seedOrders, userOrders)
  }
}

function App() {
  const [orders, setOrders] = useState(loadOrders)
  const [syncStatus, setSyncStatus] = useState(REMOTE_ORDERS_URL ? 'connecting' : 'local')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(THEME_KEY) === 'dark'
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [tableFilter, setTableFilter] = useState('All')
  const [timeFilter, setTimeFilter] = useState('All time')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [menuOpen, setMenuOpen] = useState(false)

  const fetchRemoteOrders = async () => {
    if (!REMOTE_ORDERS_URL) return []

    try {
      const response = await fetch(REMOTE_ORDERS_URL, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Remote sync failed: ${response.status}`)
      }

      const payload = await response.json()
      setSyncStatus('connected')
      return normalizeRemoteOrdersPayload(payload)
    } catch {
      setSyncStatus('disconnected')
      return []
    }
  }

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 5000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let disposed = false

    const syncOrders = async () => {
      const localOrders = loadOrders()
      const remoteOrders = await fetchRemoteOrders()
      if (disposed) return
      setOrders(mergeOrderSources(localOrders, remoteOrders))
    }

    syncOrders()
    const syncTimer = window.setInterval(syncOrders, 4000)

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === USER_STORAGE_KEY) {
        syncOrders()
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      disposed = true
      window.clearInterval(syncTimer)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    document.title = 'BrewBite Admin Portal'
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    window.localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const metrics = useMemo(() => {
    const active = orders.filter((order) => order.status !== 'Served')
    const progress = orders.filter((order) => ['Accepted', 'Preparing', 'Ready'].includes(order.status))
    const complete = orders.filter((order) => order.status === 'Served')
    return {
      activeCount: active.length,
      progressCount: progress.length,
      completeCount: complete.length,
      avgWait: getAverageWaitMinutes(orders, now),
      todayRevenue: orders
        .filter((order) => sameDay(order.createdAt, now) && order.status === 'Served')
        .reduce((sum, order) => sum + order.total, 0),
    }
  }, [orders, now])

  const tableOptions = useMemo(() => {
    const tables = Array.from(new Set(orders.map((order) => order.type === 'Takeaway' ? 'Takeaway' : `Table ${order.tableNumber}`)))
    return ['All', ...tables.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))]
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = [order.id, order.tableNumber, order.type, order.status]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter
      const matchesTable = tableFilter === 'All' || (order.type === 'Takeaway' ? 'Takeaway' : `Table ${order.tableNumber}`) === tableFilter
      const matchesTime = (() => {
        if (timeFilter === 'All time') return true
        if (timeFilter === 'Today') return sameDay(order.createdAt, now)
        if (timeFilter === 'Yesterday') {
          const d = new Date(now)
          d.setDate(d.getDate() - 1)
          return sameDay(order.createdAt, d.getTime())
        }
        if (timeFilter === '7 days') return now - order.createdAt <= 7 * 24 * 60 * 60 * 1000
        return true
      })()
      return matchesSearch && matchesStatus && matchesTable && matchesTime
    })
  }, [orders, query, statusFilter, tableFilter, timeFilter, now])

  const sortedOrders = useMemo(
    () => [...filteredOrders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [filteredOrders],
  )

  const activeOrders = sortedOrders.filter((order) => order.status !== 'Served')
  const servedOrders = filteredOrders.filter((order) => order.status === 'Served')

  const activeSerialMap = useMemo(() => {
    const serialMap = new Map()
    activeOrders.forEach((order, index) => {
      serialMap.set(order.id, index + 1)
    })
    return serialMap
  }, [activeOrders])

  const activeGroups = useMemo(() => groupByTable(activeOrders), [activeOrders])
  const historyGroups = useMemo(() => groupByDate(servedOrders), [servedOrders])
  const pendingOrders = useMemo(
    () => activeOrders.filter((order) => order.status === 'Pending').sort((a, b) => a.createdAt - b.createdAt),
    [activeOrders],
  )

  const updateStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: nextStatus, updatedAt: Date.now() }
          : order,
      ),
    )
  }

  const activeDetails = selectedOrder ? orders.find((order) => order.id === selectedOrder.id) || selectedOrder : null

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Coffee size={24} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-title">BrewBite Admin</div>
            <div className="brand-subtitle">Control Center</div>
          </div>
        </div>

        <div className="nav-list">
          {TAB_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id)
                  setMenuOpen(false)
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        <div className="nav-meta">
          <div className="mini-copy">Live refresh every 5 seconds</div>
          <div style={{ marginTop: 8, color: 'var(--text)', fontWeight: 700 }}>{formatDateTime(now)}</div>
          <div style={{ marginTop: 14 }} className="mini-copy">
            Tablet-friendly layout for counter use.
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="main-container">
          <header className="portal-nav">
            <div className="portal-brand" onClick={() => setActiveTab('dashboard')}>
              <div className="portal-brand-mark">
                <Coffee size={20} strokeWidth={2.5} />
              </div>
              <span>BrewBite Admin</span>
            </div>

            <div className="top-actions">
              <div className={`sync-indicator ${syncStatus}`}>
                {syncStatus === 'connected' ? 'Live Feed Connected' : syncStatus === 'disconnected' ? 'Live Feed Offline' : syncStatus === 'connecting' ? 'Connecting Feed' : 'Local Mode'}
              </div>
              <button className="icon-circle" onClick={() => setOrders(loadOrders())} title="Refresh orders">
                <RefreshCcw size={18} />
              </button>
              <button className="icon-circle" onClick={() => setIsDarkMode((prev) => !prev)} title="Toggle theme">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="icon-circle badge-btn" onClick={() => setActiveTab('active')} title="Live order notifications">
                <Bell size={18} />
                <span className="notif-badge">{activeOrders.length}</span>
              </button>
              <button className="icon-pill ghost" onClick={() => setMenuOpen((prev) => !prev)}>
                <Menu size={18} />
                Menu
              </button>
            </div>
          </header>

          <div className="topbar">
            <div className="hero-card">
              <div className="order-inline" style={{ marginBottom: 10 }}>
                <span className="icon-pill"><Sparkles size={16} /> Live orders</span>
                <span className="subtle-link">Same BrewBite experience, optimized for operations</span>
              </div>
              <h1 className="hero-title">Live Orders and Past Orders at one glance.</h1>
              <p className="hero-copy">
                Monitor tickets in real-time from customer checkouts, manage workflow quickly, and keep the admin portal aligned with BrewBite brand visuals.
              </p>
            </div>
          </div>

          <div className="mobile-tabs">
            {TAB_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  className={activeTab === item.id ? 'active' : ''}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="toolbar">
            <label>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order ID or table number"
              />
            </label>
            <label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {['All', ...STATUS_ORDER].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <select value={tableFilter} onChange={(e) => setTableFilter(e.target.value)}>
                {tableOptions.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                {['All time', 'Today', 'Yesterday', '7 days'].map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div key={activeTab} className="tab-transition">

            {activeTab === 'dashboard' && (
              <section className="section">
            <div className="stats-grid">
              <StatCard label="Total Active Orders" value={metrics.activeCount} copy="Pending plus in-flight kitchen tickets" />
              <StatCard label="Orders in Progress" value={metrics.progressCount} copy="Accepted, preparing, or ready" />
              <StatCard label="Completed Orders" value={metrics.completeCount} copy="Served and closed tickets" />
              <StatCard label="Average Wait Time" value={`${metrics.avgWait.toFixed(1)} min`} copy={`Today revenue: ${formatCurrency(metrics.todayRevenue)}`} />
            </div>

            <div className="panel-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title">Active Orders</h2>
                    <p className="panel-subtitle">Grouped by table for counter use</p>
                  </div>
                  <div className="subtle-link">{activeOrders.length} tickets</div>
                </div>
                <div className="order-list">
                  {activeGroups.length === 0 ? (
                    <div className="empty-state">No active orders match the current filters.</div>
                  ) : (
                    activeGroups.map((group) => (
                      <div key={group.title} className="table-group">
                        <div className="group-title">
                          <strong>{group.title}</strong>
                          <span>{group.list.length} order(s)</span>
                        </div>
                        {group.list.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            serialNumber={activeSerialMap.get(order.id)}
                            onOpen={() => setSelectedOrder(order)}
                            onUpdate={updateStatus}
                            now={now}
                          />
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="side-panel">
                <div className="side-panel-header">
                  <div>
                    <h2 className="panel-title">Live Summary</h2>
                    <p className="panel-subtitle">Quick operational view</p>
                  </div>
                  <Filter size={18} />
                </div>
                <div className="side-panel-body">
                  <div className="mini-card">
                    <div className="mini-copy">Current load</div>
                    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{metrics.activeCount}</div>
                    <div className="mini-copy">Tickets waiting on kitchen workflow</div>
                  </div>
                  <div className="mini-card">
                    <div className="mini-copy">Recent activity</div>
                    <div style={{ marginTop: 10 }} className="timeline">
                      {[...orders]
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 5)
                        .map((order) => (
                          <div className="timeline-row" key={order.id}>
                            <span>{order.id}</span>
                            <span>{formatTimeOnly(order.createdAt)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="mini-card">
                    <div className="mini-copy">Table heat</div>
                    <div className="table-summary" style={{ marginTop: 10 }}>
                      {groupByTable(activeOrders).slice(0, 4).map((group) => (
                        <div key={group.title} className="table-summary-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <strong>{group.title}</strong>
                            <span>{group.list.length}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </section>
            )}

            {activeTab === 'active' && (
              <section className="section">
            <div className="panel-grid accept-layout">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title">Active Orders</h2>
                    <p className="panel-subtitle">Accept, prepare, and serve without leaving the board.</p>
                  </div>
                  <div className="subtle-link">{activeOrders.length} matching order(s)</div>
                </div>
                <div className="order-list">
                  {activeGroups.length === 0 ? (
                    <div className="empty-state">No active orders match the current filters.</div>
                  ) : (
                    activeGroups.map((group) => (
                      <div key={group.title} className="table-group">
                        <div className="group-title">
                          <strong>{group.title}</strong>
                          <span>{group.list.length} order(s)</span>
                        </div>
                        {group.list.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            serialNumber={activeSerialMap.get(order.id)}
                            onOpen={() => setSelectedOrder(order)}
                            onUpdate={updateStatus}
                            now={now}
                          />
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="side-panel accept-panel">
                <div className="side-panel-header">
                  <div>
                    <h2 className="panel-title">Admin Acceptance</h2>
                    <p className="panel-subtitle">Pending orders waiting for approval</p>
                  </div>
                  <div className="subtle-link">{pendingOrders.length} pending</div>
                </div>

                <div className="side-panel-body">
                  {pendingOrders.length === 0 ? (
                    <div className="mini-card">
                      <div className="mini-copy">Queue status</div>
                      <div className="accept-empty">No pending orders right now.</div>
                    </div>
                  ) : (
                    <>
                      <div className="accept-list">
                        {pendingOrders.slice(0, 8).map((order) => (
                          <div key={order.id} className="accept-item">
                            <div>
                              <div className="accept-id">Order #{order.id}</div>
                              <div className="mini-copy">
                                {order.type === 'Takeaway' ? 'Takeaway' : `Table ${order.tableNumber}`} • {formatTimeOnly(order.createdAt)}
                              </div>
                            </div>
                            <div className="accept-actions">
                              <span className="accept-total">{formatCurrency(order.total)}</span>
                              <button className="accept-btn" onClick={() => updateStatus(order.id, 'Accepted')}>
                                Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {pendingOrders.length > 1 && (
                        <button
                          className="accept-all-btn"
                          onClick={() => pendingOrders.forEach((order) => updateStatus(order.id, 'Accepted'))}
                        >
                          Accept all pending orders
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
              </section>
            )}

            {activeTab === 'history' && (
              <section className="section">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Order History</h2>
                  <p className="panel-subtitle">Completed orders grouped by day.</p>
                </div>
                <div className="subtle-link">{servedOrders.length} served order(s)</div>
              </div>
              <div className="history-list">
                {historyGroups.length === 0 ? (
                  <div className="empty-state">No completed orders for the selected filters.</div>
                ) : (
                  historyGroups.map((group) => (
                    <div key={group.dateKey} className="day-group">
                      <div className="group-title">
                        <strong>{formatDayLabel(group.list[0]?.createdAt || group.dateKey)}</strong>
                        <span>
                          {group.list.length} order(s) • {formatCurrency(group.list.reduce((sum, order) => sum + order.total, 0))}
                        </span>
                      </div>
                      {group.list.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onOpen={() => setSelectedOrder(order)}
                          onUpdate={updateStatus}
                          now={now}
                        />
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {selectedOrder && (
        <OrderDrawer
          order={activeDetails}
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateStatus}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, copy }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">{copy}</div>
    </div>
  )
}

function OrderCard({ order, serialNumber, onOpen, onUpdate, now }) {
  const status = statusMeta[order.status] || statusMeta.Pending
  const StatusIcon = status.icon
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const isNew = order.status === 'Pending' && now - order.createdAt < 3 * 60 * 1000

  return (
    <div className={`order-card ${isNew ? 'new' : ''}`}>
      <div className="order-top">
        <div>
          {serialNumber ? <p className="order-serial">#{serialNumber} Order</p> : null}
          <p className="order-id">Order #{order.id}</p>
          <div className="order-time">Placed {formatDateTime(order.createdAt)}</div>
        </div>
        <span className={`badge ${status.className}`}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </div>

      <div className="order-inline">
        <span className="order-table">
          <Table2 size={15} />
          {order.type === 'Takeaway' ? 'Takeaway' : `Table ${order.tableNumber}`}
        </span>
        <span className="mini-copy">{itemCount} item(s)</span>
        <span className="mini-copy">Total {formatCurrency(order.total)}</span>
      </div>

      <div className="mini-copy">
        {order.specialInstructions || 'No special instructions'}
      </div>

      <details className="item-summary">
        <summary onClick={(event) => event.stopPropagation()}>
          <span>Items ({order.items.length})</span>
          <ChevronDown size={16} />
        </summary>
        <div className="item-list" onClick={(event) => event.stopPropagation()}>
          {order.items.map((item, index) => (
            <div className="item-row" key={`${order.id}-${index}`}>
              <div>
                <strong>{item.quantity}x {item.name}</strong>
                <small>{item.customizations || 'Standard preparation'}</small>
              </div>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
      </details>

      <div className="action-row">
        {STATUS_ORDER.map((statusName) => (
          <button
            key={statusName}
            className={`action-btn ${statusMeta[statusName].className} ${statusIndex(order.status) > statusIndex(statusName) ? 'inactive' : ''}`}
            onClick={() => onUpdate(order.id, statusName)}
            disabled={statusIndex(order.status) > statusIndex(statusName)}
          >
            {statusName}
          </button>
        ))}
      </div>

      <button className="icon-pill" onClick={onOpen} style={{ justifyContent: 'center' }}>
        <Eye size={16} />
        View details
      </button>
    </div>
  )
}

function OrderDrawer({ order, onClose, onUpdate }) {
  const status = statusMeta[order.status] || statusMeta.Pending
  const StatusIcon = status.icon
  const activeStep = STATUS_ORDER.indexOf(order.status)

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-inner">
          <div className="drawer-header">
            <div>
              <div className={`badge ${status.className}`}>
                <StatusIcon size={12} />
                {status.label}
              </div>
              <h2 className="drawer-title" style={{ marginTop: 14 }}>
                Order #{order.id}
              </h2>
              <div className="order-time" style={{ marginTop: 8 }}>
                {formatDateTime(order.createdAt)}
              </div>
            </div>
            <button className="drawer-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="drawer-grid">
            <div className="mini-card">
              <div className="mini-copy">Table / Type</div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>
                {order.type === 'Takeaway' ? 'Takeaway' : `Table ${order.tableNumber}`}
              </div>
            </div>
            <div className="mini-card">
              <div className="mini-copy">Total</div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>{formatCurrency(order.total)}</div>
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-copy">Special instructions</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>
              {order.specialInstructions || 'No special instructions'}
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-copy">Status timeline</div>
            <div className="timeline" style={{ marginTop: 10 }}>
              {STATUS_ORDER.map((step, index) => (
                <div key={step} className="timeline-row">
                  <span>{step}</span>
                  <span>{index <= activeStep ? 'Completed' : 'Next'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-copy">Full item list</div>
            <div className="drawer-list" style={{ marginTop: 12 }}>
              {order.items.map((item, index) => (
                <div className="item-row" key={`${order.id}-drawer-${index}`}>
                  <div>
                    <strong>{item.quantity}x {item.name}</strong>
                    <small>{item.customizations || 'Standard preparation'}</small>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="action-row">
            {STATUS_ORDER.map((statusName) => (
              <button
                key={statusName}
                className={`action-btn ${statusMeta[statusName].className} ${statusIndex(order.status) > statusIndex(statusName) ? 'inactive' : ''}`}
                onClick={() => onUpdate(order.id, statusName)}
                disabled={statusIndex(order.status) > statusIndex(statusName)}
              >
                Mark {statusName}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

export default App
