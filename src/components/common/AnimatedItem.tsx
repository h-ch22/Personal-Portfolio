import { motion } from 'framer-motion'

interface AnimatedItemProps {
  children: React.ReactNode
  index?: number
  className?: string
}

const AnimatedItem = ({ children, index = 0, className }: AnimatedItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
    transition={{
      delay: Math.min(index * 0.05, 0.4),
      duration: 0.4,
      ease: 'easeOut',
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export { AnimatedItem }
