"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Code2, Brain, Sparkles } from "lucide-react"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="sobre" className="py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="text-primary font-mono text-sm">01.</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Sobre mim</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 space-y-4"
            >
              <p className="text-muted-foreground text-lg leading-relaxed">
                Engenheiro de software focado no desenvolvimento de aplicações escaláveis e de alta performance. 
                Crio soluções que integram 
                <span className="text-foreground font-medium"> inteligência artificial</span> e 
                <span className="text-foreground font-medium"> interfaces modernas</span>, 
                com foco em eficiência, usabilidade e impacto real no negócio.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Atualmente, foco no desenvolvimento de soluções com 
                <span className="text-primary"> Large Language Models</span> e 
                <span className="text-primary"> Agentes Inteligentes</span>, 
                aplicando padrões consolidados como 
                <span className="text-primary"> Clean Architecture </span> 
                para construir sistemas robustos, escaláveis e de fácil manutenção.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                { icon: Code2, label: "Clean Code", desc: "Código limpo e testável" },
                { icon: Brain, label: "AI/ML", desc: "Soluções inteligentes" },
                { icon: Sparkles, label: "UX Focus", desc: "Experiências incríveis" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
