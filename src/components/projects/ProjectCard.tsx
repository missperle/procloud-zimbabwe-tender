
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  title: string;
  imageUrl: string;
  authorName: string;
  likes: number;
  views: number;
  featured?: boolean;
}

const ProjectCard = ({ id, title, imageUrl, authorName, likes, views, featured = false }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`project-card rounded-md overflow-hidden shadow-card mb-6 ${
        featured ? 'featured' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/projects/${id}`} className="block relative">
        <div className="aspect-w-16 aspect-h-12 w-full">
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full rounded-t-md"
          />
        </div>
        
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-white font-medium text-lg">{title}</h3>
          </div>
        </div>
        
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="featured-badge">Featured</span>
          </div>
        )}
      </Link>
      
      <div className="project-card-footer p-3 bg-white flex justify-between items-center">
        <Link to="/profile" className="text-sm font-medium hover:text-procloud-green transition-colors">
          {authorName}
        </Link>
        
        <div className="flex items-center space-x-3 text-procloud-gray-500">
          <div className="flex items-center space-x-1">
            <Heart size={14} />
            <span className="text-xs">{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span className="text-xs">{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
