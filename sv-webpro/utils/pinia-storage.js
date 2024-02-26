import {
  useSysStore
} from "@/store/sys"
import {
  useSvidStore
} from "@/store/svid"
import {
  dictList
} from "@/service/api/sys"
import {
  permissionList,
  roleList
} from "@/service/api/svid"

export async function storageDicts() {
  const sysStore = useSysStore()
  const dictRes = await dictList()
  sysStore.setDicts(dictRes.data)
}

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
    storageDicts()
  ])
}

export function refreshPiniaStorage() {
  return Promise.all([
    storageRoles(),
    storagePermissions(),
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
  sysStore.clearDicts()
}

export function clearPiniaStorage() {
  clearSvidStorage()
  clearSysStorage()
}