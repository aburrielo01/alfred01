export type Tab = 'hoy' | 'sistema' | 'revision' | 'perfil'

export interface Route {
  tab: Tab
  branchId?: string
}
