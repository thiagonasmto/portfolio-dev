"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mail, ArrowUpRight, Github, Linkedin, Twitter, Instagram } from "lucide-react"

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contato" className="py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="text-primary font-mono text-sm mb-4 block">05. E agora?</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Vamos construir algo incrível juntos?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades 
            para fazer parte de suas visões. Se você tem uma ideia ou projeto em mente, 
            entre em contato!
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="mailto:thiagonasmento25@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Enviar email
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <a
                href="/CurriculoDev-Thiago-Lopes.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver currículo
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-6"
          >
            {[
              { icon: Github, href: "https://github.com/thiagonasmto", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/thiago-lopes-eng-comp/", label: "LinkedIn" },
              { icon: Instagram, href: "https://www.instagram.com/thiago.nasmto/", label: "Instagram" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary hover:bg-primary text-muted-foreground hover:text-primary-foreground transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
