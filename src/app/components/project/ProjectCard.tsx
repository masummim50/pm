import React, { useState, useEffect } from "react";
import { projectType } from "./project.interface";
import {
  useDeletePersonalProjectMutation,
  useDeleteTeamProjectMutation,
} from "../../redux/features/project/project.api";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import EditProjectModal from "./EditProjectModal";
import Participants from "./Participants";
import {
  Edit3,
  Trash2,
  Users,
  Folder,
  ChevronRight,
  User,
  Clock,
  CheckCircle2,
  Zap
} from "lucide-react";

const ProjectCard = ({
  project,
  time,
}: {
  project: projectType;
  time: number;
}) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(false);
    }, time);
    return () => clearTimeout(timer);
  }, [time]);

  const [deleteProject] = useDeletePersonalProjectMutation();
  const [deleteTeamProject] = useDeleteTeamProjectMutation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.type === "personal") {
      deleteProject(project._id);
    } else {
      deleteTeamProject(project._id);
    }
  };

  const handleGoToDetails = () => {
    navigate(`${pathname + "/" + project._id}`);
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const isPersonal = project.type === "personal";

  const statusConfig = {
    pending: { color: "text-amber-400", bg: "bg-amber-400/10", icon: Clock },
    complete: { color: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2 },
    active: { color: "text-blue-400", bg: "bg-blue-400/10", icon: Zap },
  };

  const currentStatus = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div
      className={`
        w-full h-full p-2 transition-all duration-700 ease-out
        ${hidden ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"}
        ${project.deleting ? "scale-0 opacity-0" : "scale-100"}
      `}
    >
      <EditProjectModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        project={project}
      />

      <div
        onClick={handleGoToDetails}
        className={`
          relative h-full overflow-hidden rounded-[2.5rem] border backdrop-blur-xl p-7
          transition-all duration-500 cursor-pointer group
          bg-neutral-900/40 border-white/5 hover:border-white/10 hover:bg-neutral-800/50 hover:shadow-2xl hover:shadow-black/50
        `}
      >
        {/* Type Icon Background Glow */}
        <div className={`
          absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-colors duration-700
          ${isPersonal ? 'bg-purple-500' : 'bg-amber-500'}
        `} />

        {/* Header: Status & Type */}
        <div className="flex items-center justify-between mb-8">
          <div className={`
            flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold
            ${isPersonal ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}
          `}>
            {isPersonal ? <User className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
            <span className="text-[10px] uppercase tracking-[0.15em]">{project.type}</span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${currentStatus.bg}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${currentStatus.color}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${currentStatus.color}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Project Title & Meta */}
        <div className="space-y-4 mb-8">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-500 transition-all duration-300 line-clamp-1">
              {project.name}
            </h2>
            <div className="flex items-center gap-2 text-neutral-500">
              <Folder className="w-3.5 h-3.5 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Project Space</span>
            </div>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
            {project.description}
          </p>
        </div>

        {/* Bottom Bar: Collaborators & Actions */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {project.type === "team" ? (
              <Participants participants={project.participants} />
            ) : (
              <div className="flex items-center gap-2 group/owner">
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center group-hover/owner:bg-purple-500/20 transition-colors">
                  <User className="w-4 h-4 text-neutral-500 group-hover/owner:text-purple-400" />
                </div>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest group-hover/owner:text-neutral-400 transition-colors">Private Lab</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            {project.user === user.id && (
              <>
                <button
                  onClick={handleOpenModal}
                  className="p-2.5 rounded-2xl bg-neutral-950 border border-white/5 text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
                  title="Edit Project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2.5 rounded-2xl bg-neutral-950 border border-white/5 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <div className={`p-2.5 rounded-2xl transition-all shadow-xl shadow-black/20
                ${isPersonal ? 'bg-purple-500 text-white' : 'bg-amber-500 text-white'}
            `}>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
