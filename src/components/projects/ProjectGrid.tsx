
import ProjectCard from './ProjectCard';

// Sample project data
const projects = [
  {
    id: '1',
    title: 'Digital Tender Platform UI Design',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    authorName: 'Alex Johnson',
    likes: 253,
    views: 1420,
    featured: true
  },
  {
    id: '2',
    title: 'Freelancer Portfolio Website',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    authorName: 'Maria Garcia',
    likes: 127,
    views: 891
  },
  {
    id: '3',
    title: 'Mobile Payment App Interface',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    authorName: 'David Smith',
    likes: 341,
    views: 2100,
    featured: true
  },
  {
    id: '4',
    title: 'E-commerce Dashboard Redesign',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    authorName: 'Zoe Williams',
    likes: 184,
    views: 1250
  },
  {
    id: '5',
    title: 'Blockchain Visualization Tool',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    authorName: 'James Lee',
    likes: 209,
    views: 1567
  },
  {
    id: '6',
    title: 'Social Media Analytics Dashboard',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    authorName: 'Emma Taylor',
    likes: 142,
    views: 978
  },
  {
    id: '7',
    title: 'Video Conferencing App UI',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    authorName: 'Michael Chen',
    likes: 275,
    views: 1889
  },
  {
    id: '8',
    title: 'Code Editor Theme Design',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    authorName: 'Sophia Brown',
    likes: 165,
    views: 1234
  }
];

const ProjectGrid = () => {
  return (
    <section className="project-grid-section py-10 px-6">
      <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
      <div className="project-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            id={project.id}
            title={project.title}
            imageUrl={project.imageUrl}
            authorName={project.authorName}
            likes={project.likes}
            views={project.views}
            featured={project.featured}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;
