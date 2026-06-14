import clsx from "clsx"

interface SidebarActionButtonProps {
  icon: React.ReactNode
  label: string
  isCollapsed: boolean
  onClick: () => void
}

export function SidebarActionButton({
  icon,
  label,
  isCollapsed,
  onClick,
}: SidebarActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-2 px-3 py-2 rounded-md transition-colors text-left",
        "text-gray-700 hover:bg-gray-100"
      )}
    >
      <span className="w-6 h-6">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </button>
  )
}
