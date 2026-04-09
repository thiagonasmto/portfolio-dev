"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ExternalLink } from "lucide-react"

const experiences = [
  {
    period: "2023 — Presente",
    role: "Senior Software Engineer",
    company: "TechAI Labs",
    companyUrl: "https://example.com",
    description: "Lidero o desenvolvimento de soluções de IA generativa, incluindo chatbots empresariais e sistemas de recomendação. Responsável pela arquitetura de microservices e implementação de pipelines de ML.",
    technologies: ["Python", "TypeScript", "LangChain", "AWS", "Kubernetes"],
  },
  {
    period: "2021 — 2023",
    role: "Full Stack Developer",
    company: "StartupX",
    companyUrl: "https://example.com",
    description: "Desenvolvi aplicações web de alta performance usando React e Node.js. Implementei sistemas de processamento de dados em tempo real e integração com múltiplas APIs.",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
  },
  {
    period: "2019 — 2021",
    role: "Software Developer",
    company: "Digital Agency",
    companyUrl: "https://example.com",
    description: "Criação de aplicações web responsivas e APIs RESTful. Participação em projetos de e-commerce e sistemas de gestão empresarial.",
    technologies: ["JavaScript", "Vue.js", "Python", "Django", "MySQL"],
  },
  {
    period: "2018 — 2019",
    role: "Junior Developer",
    company: "Tech Solutions",
    description: "Início da carreira desenvolvendo features para sistemas internos e manutenção de aplicações legadas. Aprendizado de boas práticas de desenvolvimento.",
    technologies: ["JavaScript", "PHP", "HTML/CSS", "Git"],
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
