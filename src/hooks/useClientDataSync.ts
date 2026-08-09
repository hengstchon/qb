import { useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { useTheme } from 'next-themes'
import {
  loadSharedClientSettings,
  pickSharedTableState,
  storeSharedClientSettings,
  type SharedClientSettings,
} from '@/services/clientData'
import {
  connectionInfoAtom,
  fileTableStateAtom,
  peerTableStateAtom,
  settingsAtom,
  torrentTableStateAtom,
  trackerTableStateAtom,
} from '@/store'

export const useClientDataSync = () => {
  const connectionInfo = useAtomValue(connectionInfoAtom)
  const [settings, setSettings] = useAtom(settingsAtom)
  const [torrentTable, setTorrentTable] = useAtom(torrentTableStateAtom)
  const [trackerTable, setTrackerTable] = useAtom(trackerTableStateAtom)
  const [peerTable, setPeerTable] = useAtom(peerTableStateAtom)
  const [fileTable, setFileTable] = useAtom(fileTableStateAtom)
  const { theme, setTheme } = useTheme()
  const [loaded, setLoaded] = useState(false)
  const loadPromise = useRef<ReturnType<typeof loadSharedClientSettings>>(null)
  const supportsClientData =
    connectionInfo?.capabilities.supportsClientData ?? false

  useEffect(() => {
    setLoaded(false)
    if (!supportsClientData) {
      loadPromise.current = null
      return
    }
    let cancelled = false

    loadPromise.current ??= loadSharedClientSettings()
    void loadPromise.current
      .then((remote) => {
        if (cancelled || !remote) return
        setSettings((current) => ({
          ...current,
          refreshInterval: remote.refreshInterval,
          ...(remote.interface ?? {}),
        }))
        setTorrentTable((current) => ({ ...current, ...remote.torrentTable }))
        setTrackerTable((current) => ({ ...current, ...remote.trackerTable }))
        setPeerTable((current) => ({ ...current, ...remote.peerTable }))
        setFileTable((current) => ({ ...current, ...remote.fileTable }))
        if (remote.theme) setTheme(remote.theme)
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [supportsClientData])

  useEffect(() => {
    if (!supportsClientData || !loaded) return
    const shared: SharedClientSettings = {
      schemaVersion: 1,
      refreshInterval: settings.refreshInterval,
      theme,
      interface: {
        detailsTab: settings.detailsTab,
        openDetails: settings.openDetails,
        openSidebar: settings.openSidebar,
        openSidebarStatus: settings.openSidebarStatus,
        openSidebarCategories: settings.openSidebarCategories,
        openSidebarTags: settings.openSidebarTags,
        openSidebarTrackers: settings.openSidebarTrackers,
      },
      torrentTable: pickSharedTableState(torrentTable),
      trackerTable: pickSharedTableState(trackerTable),
      peerTable: pickSharedTableState(peerTable),
      fileTable: pickSharedTableState(fileTable),
    }
    const timeout = setTimeout(() => {
      void storeSharedClientSettings(shared).catch(() => undefined)
    }, 500)
    return () => clearTimeout(timeout)
  }, [
    fileTable,
    loaded,
    peerTable,
    settings.refreshInterval,
    settings.detailsTab,
    settings.openDetails,
    settings.openSidebar,
    settings.openSidebarCategories,
    settings.openSidebarStatus,
    settings.openSidebarTags,
    settings.openSidebarTrackers,
    supportsClientData,
    theme,
    torrentTable,
    trackerTable,
  ])
}
