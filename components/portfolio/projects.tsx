"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ExternalLink, Github, Folder } from "lucide-react"

const projects = [
  {
    title: "AI Chat Assistant",
    description: "Assistente conversacional inteligente com suporte a múltiplos modelos de linguagem, memória contextual e integração com APIs externas.",
    tags: ["Next.js", "OpenAI", "LangChain", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: true,
  },
  {
    title: "Computer Vision Pipeline",
    description: "Pipeline de processamento de imagens em tempo real para detecção de objetos e análise de sentimentos faciais.",
    tags: ["Python", "PyTorch", "FastAPI", "Docker"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: true,
  },
  {
    title: "MLOps Platform",
    description: "Plataforma completa para gerenciamento do ciclo de vida de modelos de machine learning, incluindo treinamento, versionamento e deploy.",
    tags: ["Kubernetes", "MLflow", "Airflow", "AWS"],
    github: "https://github.com",
    featured: true,
  },
  {
    title: "Real-time Analytics Dashboard",
    description: "Dashboard interativo para visualização de métricas em tempo real com streaming de dados.",
    tags: ["React", "D3.js", "WebSocket", "Redis"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "NLP Text Analyzer",
    description: "Ferramenta de análise de texto com extração de entidades, classificação de sentimentos e sumarização automática.",
    tags: ["Python", "Hugging Face", "spaCy", "FastAPI"],
    github: "https://github.com",
  },
  {
    title: "Microservices Starter Kit",
    description: "Boilerplate para desenvolvimento de microservices com autenticação, logging e monitoramento integrados.",
    tags: ["Go", "gRPC", "Prometheus", "Grafana"],
    github: "https://github.com",
  },
]

export function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <section id="projetos" className="py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="text-primary font-mono text-sm">03.</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Projetos em Destaque</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Featured Projects */}
          <div className="space-y-12 mb-16">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 md:p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-primary font-mono text-sm mb-2">Projeto em Destaque</p>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-xl">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        aria-label="Ver no GitHub"
                      >
                        <Github className="h-5 w-5" />
                      </motion.a>
                    )}
                    {project.demo && (
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        aria-label="Ver demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Other Projects */}
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Outros Projetos
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="group p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Folder className="h-8 w-8 text-primary" />
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Ver no GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Ver demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
