import ProjectCard from '../projects/ProjectCard'

export default function ProjectGrid({ projects }) {
  return (
    <ul className="grid grid--3">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}
