import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

const iconAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(117,103,246,0.2)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full border-2 border-[rgba(117,103,246,0.2)]">
        <CardHeader>
          <motion.div 
            className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(117,103,246,0.1)] text-[rgb(117,103,246)]"
            variants={iconAnimation}
            animate="animate"
          >
            {icon}
          </motion.div>
          <CardTitle className="text-[rgb(117,103,246)]">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

