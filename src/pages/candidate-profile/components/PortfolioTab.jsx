import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PortfolioTab = ({ candidate, onUpdatePortfolio }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    images: []
  });

  const handleAddProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      const project = {
        ...newProject,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      onUpdatePortfolio([...candidate.portfolio, project]);
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        images: []
      });
      setIsAddingProject(false);
    }
  };

  const handleRemoveProject = (projectId) => {
    onUpdatePortfolio(candidate.portfolio.filter(project => project.id !== projectId));
  };

  const handleTechnologyAdd = (tech) => {
    if (tech.trim() && !newProject.technologies.includes(tech.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, tech.trim()]
      });
    }
  };

  const handleTechnologyRemove = (tech) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter(t => t !== tech)
    });
  };

  const ProjectModal = ({ project, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">{project.title}</h3>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Description</h4>
              <p className="text-text-secondary leading-relaxed">{project.description}</p>
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-text-secondary">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project Links */}
            <div className="flex space-x-4 pt-4">
              {project.liveUrl && (
                <Button
                  variant="primary"
                  iconName="ExternalLink"
                  iconPosition="left"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  View Live
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  variant="outline"
                  iconName="Github"
                  iconPosition="left"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
                  View Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Portfolio & Projects</h3>
          <Button
            variant="primary"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingProject(true)}
          >
            Add Project
          </Button>
        </div>
        <p className="text-text-secondary">
          Showcase your best work and demonstrate your technical capabilities to potential employers.
        </p>
      </div>

      {/* Add Project Form */}
      {isAddingProject && (
        <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
          <h4 className="text-lg font-semibold text-text-primary mb-4">Add New Project</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., E-commerce Platform"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Live URL (Optional)</label>
                <input
                  type="url"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://your-project.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">GitHub URL (Optional)</label>
              <input
                type="url"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your project, its purpose, and key features..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary text-sm rounded-full"
                  >
                    <span>{tech}</span>
                    <button
                      onClick={() => handleTechnologyRemove(tech)}
                      className="text-primary hover:text-primary-600"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTechnologyAdd(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type technology and press Enter (e.g., React, Node.js, MongoDB)"
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="primary" onClick={handleAddProject}>
                Add Project
              </Button>
              <Button variant="outline" onClick={() => setIsAddingProject(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidate.portfolio.map((project) => (
          <div key={project.id} className="bg-surface rounded-lg shadow-elevation-1 overflow-hidden group hover:shadow-elevation-3 transition-shadow">
            {/* Project Image */}
            <div className="relative h-48 bg-surface-hover overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <Image
                  src={project.images[0]}
                  alt={`${project.title} preview`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Code" size={32} className="text-text-tertiary" />
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    onClick={() => setSelectedProject(project)}
                    className="px-3 py-2"
                  >
                    View Details
                  </Button>
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      iconName="ExternalLink"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                      className="px-3 py-2 bg-surface text-text-primary"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-text-primary">{project.title}</h4>
                <button
                  onClick={() => handleRemoveProject(project.id)}
                  className="text-text-tertiary hover:text-error transition-colors"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
              
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-surface-hover text-text-tertiary text-xs rounded-full">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Project Links */}
              <div className="flex items-center space-x-3 text-sm">
                {project.githubUrl && (
                  <button
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    className="flex items-center space-x-1 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <Icon name="Github" size={14} />
                    <span>Code</span>
                  </button>
                )}
                {project.liveUrl && (
                  <button
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="flex items-center space-x-1 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <Icon name="ExternalLink" size={14} />
                    <span>Live</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidate.portfolio.length === 0 && (
        <div className="bg-surface rounded-lg p-12 text-center shadow-elevation-1">
          <Icon name="FolderOpen" size={48} className="text-text-tertiary mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-text-primary mb-2">No Projects Yet</h4>
          <p className="text-text-secondary mb-4">
            Start building your portfolio by adding your best projects and showcasing your skills.
          </p>
          <Button
            variant="primary"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingProject(true)}
          >
            Add Your First Project
          </Button>
        </div>
      )}

      {/* GitHub Integration */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Github" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">GitHub Integration</h3>
              <p className="text-sm text-text-secondary">Connect your GitHub to showcase your repositories</p>
            </div>
          </div>
          <Button variant="outline" iconName="Link">
            Connect GitHub
          </Button>
        </div>

        {candidate.githubStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{candidate.githubStats.repositories}</div>
              <div className="text-sm text-text-secondary">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{candidate.githubStats.followers}</div>
              <div className="text-sm text-text-secondary">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{candidate.githubStats.contributions}</div>
              <div className="text-sm text-text-secondary">Contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{candidate.githubStats.stars}</div>
              <div className="text-sm text-text-secondary">Stars</div>
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default PortfolioTab;