import { useSvidStore } from '@/store/svid.js'
import { useSysStore } from '@/store/sys'
import { useNavStore } from '@/store/nav'
import { permissionList, roleList } from '@/api/svid.js'
import { appList, dictList } from '@/api/sys'

export async function storagePermissions() {
  const svidStore = useSvidStore()
  const permissionRes = await permissionList()
  svidStore.setPermissions(permissionRes.data)
}

export async function storageRoles() {
  const svidStore = useSvidStore()
  const roleRes = await roleList()
  svidStore.setRoles(roleRes.data)
}

export async function storageApps() {
  const sysStore = useSysStore()
  const appRes = await appList()
  sysStore.setApps(appRes.data)
}

export async function storageDicts() {
  const sysStore = useSysStore()
  const dictRes = await dictList()
  sysStore.setDicts(dictRes.data)
}

/**
 * 刷新
 */
export function refreshSvidStorage() {
  return Promise.all([
    storageRoles(),
    storagePermissions()
  ])
}

export function refreshSysStorage() {
  return Promise.all([
    storageApps(),
    storageDicts()
  ])
}

export function refreshPiniaStorage() {
  return Promise.all([
    storageRoles(),
    storagePermissions(),
    storageApps(),
    storageDicts()
  ])
}

/**
 * 清除
 */
export function clearSvidStorage() {
  const svidStore = useSvidStore()
  svidStore.clearRoles()
  svidStore.clearPermissions()
}

export function clearSysStorage() {
  const sysStore = useSysStore()
  sysStore.clearApps()
  sysStore.clearDicts()
}

export function clearNavStorage() {
  const navStore = useNavStore()
  navStore.clearHistory()
}

export function clearPiniaStorage() {
  clearSvidStorage()
  clearSysStorage()
  clearNavStorage()
}