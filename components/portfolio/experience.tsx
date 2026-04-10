"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ExternalLink } from "lucide-react"

const experiences = [
  {
    period: "2025 - Atual",
    role: "FullStack Developer",
    company: "Simples Meios De Pagamento",
    companyUrl: "https://www.gruposimples.net/",
    description: "Desenvolvimento de softwares de gestão voltados ao mercado financeiro com agentes de inteligência artificial para auxilio à tomada de decisão.",
    technologies: ["Go", "PHP", "Python", "ReactJS", "FastAPI", "Ollama", "AWS", "Docker"],
  },
  {
    period: "2025 - Atual",
    role: "AI Developer",
    company: "Instituto Metrópole Digital (IMD)",
    companyUrl: "https://www.metropoledigital.ufrn.br/portal/",
    description: "Criação de agentes de inteligência artificial para integração de projetos em parceria com grandes empresas do mercado de tecnologia.",
    technologies: ["Spring Boot", "Python", "OpenAI", "PostgreSQL", "Docker"],
  },
  {
    period: "2025 — 2026",
    role: "FullStack Developer",
    company: "Fumpec / Geowellex",
    companyUrl: "https://www.geowellex.com/pt/",
    description: "Criação de aplicações para gestão de descomissionamento de poços de petróleo.",
    technologies: ["React", "Ollama", "Go", "Python", "FastAPI", "GORM", "PostgreSQL"],
  },
  {
    period: "2024 — 2025",
    role: "Software Developer",
    company: "UFRN / Petrobras",
    companyUrl: "https://www.ufrn.br/",
    description: "Desenvolvimento de solução voltada para auxílio e gestão de projetos para a Petrobras.",
    technologies: ["Python", "LangChain", "LangGraph", "Git"],
  },
]

export function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="experiencia" className="py-24 md:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="text-primary font-mono text-sm">04.</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Experiência</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative pl-8 md:pl-0 pb-12 last:pb-0 ${
                  index % 2 === 0 ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 md:left-1/2 top-0 w-3 h-3 rounded-full bg-primary border-4 border-background md:-translate-x-1/2`}
                />

                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
                  <span className="text-sm font-mono text-primary mb-2 block">
                    {exp.period}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {exp.company}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{exp.company}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono rounded bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
