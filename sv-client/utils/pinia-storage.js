import { useSysStore } from '@/store/sys'
import { dictList } from '@/api/sys'

export async function storageDicts() {
  const sysStore = useSysStore()
  const dictRes = await dictList()
  sysStore.setDicts(dictRes.data)
}