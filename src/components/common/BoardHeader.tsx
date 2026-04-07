import { PlusIcon, type LucideIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useAuthStore } from '#/stores/use-auth-store'
import { motion, type Variants } from 'framer-motion'

const BoardHeader = ({
  title,
  Icon,
  description,
  onAddButtonClick,
}: {
  title: string
  Icon: LucideIcon
  description?: string
  onAddButtonClick: () => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col gap-5 mb-10 group"
    >
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col gap-2.5">
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="w-fit flex items-center gap-1.5 px-2.5 py-0.5 bg-muted/50 text-muted-foreground font-mono text-xs border-transparent"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{title}</span>
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            <span className="bg-linear-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {description && (
            <motion.p
              variants={itemVariants}
              className="text-muted-foreground text-sm font-medium"
            >
              {description}
            </motion.p>
          )}
        </div>

        {user && isAdmin && (
          <motion.div variants={itemVariants}>
            <Button variant="outline" size="icon" onClick={onAddButtonClick}>
              <PlusIcon className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
        className="h-px bg-linear-to-r from-border via-border/40 to-transparent"
      />
    </motion.div>
  )
}

export { BoardHeader }
