export interface NavItem {
  title: string
  url: string
  isActive?: boolean
  requiredRole?: "SUPER_ADMIN" | "FACILITY_STAFF"
  items?: NavItem[]
}

export const adminNavData = {
  navMain: [
    {
      title: "Command Center",
      url: "/admin",
      isActive: true,
      items: [
        {
          title: "Global Overview",
          url: "/admin",
          isActive: true,
        },
      ],
    },
    {
      title: "Facilities Registry",
      url: "/admin/facilities",
      items: [
        {
          title: "Facility Directory",
          url: "/admin/facilities",
          isActive: false,
        },
        {
          title: "Register New Facility",
          url: "/admin/facilities/new",
          isActive: false,
          requiredRole: "SUPER_ADMIN",
        },
      ],
    },
    {
      title: "Security & Operations",
      url: "/admin/support",
      items: [
        {
          title: "Admin Users",
          url: "/admin/users",
          isActive: false,
          requiredRole: "SUPER_ADMIN",
        },
        {
          title: "Agent API Keys",
          url: "/admin/api-keys",
          isActive: false,
          requiredRole: "SUPER_ADMIN",
        },
        {
          title: "Customer Support Logs",
          url: "/admin/support",
          isActive: false,
          requiredRole: "SUPER_ADMIN",
        },
      ],
    },
  ] as NavItem[],
}
