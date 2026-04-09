"use client"

import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Lucas Silva. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Desenvolvido com{" "}
            <span className="text-primary">Next.js</span>,{" "}
            <span className="text-primary">Tailwind CSS</span> e{" "}
            <span className="text-primary">Framer Motion</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
