import { atom, useAtomValue } from 'jotai'

import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export interface UrlConfig {
  adminUrl: string

  webUrl: string
}

const adminUrlAtom = atom<string | null>(null)

export const fetchAppUrl = async () => {
  const { data } = await apiClient.proxy.options.url.get<{
    data: UrlConfig
  }>()

  jotaiStore.set(adminUrlAtom, data.adminUrl)
}

export const getAdminUrl = () => jotaiStore.get(adminUrlAtom)
export const useAppUrl = () => {
  const url = useAggregationSelector((a) => a.url)
  const adminUrl = useAtomValue(adminUrlAtom)
  return {
    adminUrl,
    ...url,
  }
}

export const useResolveAdminUrl = () => {
  const { adminUrl } = useAppUrl()
  return (path: string) => {
    if (!adminUrl) {
      return ''
    }
    return adminUrl.replace(/\/$/, '').concat(path || '')
  }
}
