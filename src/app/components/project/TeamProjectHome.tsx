import { Link } from "react-router-dom";
import { useGetTeamProjectsQuery } from "../../redux/features/project/project.api";
import { projectType } from "./project.interface";
import ProjectCard from "./ProjectCard";
import ProjectCardsLoading from "../loadingSkeletons/ProjectCardsLoading";
import NoItemFound from "./NoItemFound";
import useDocumentTitle from "../../../UseDocumentTitle";
import {
  Plus,
  Users,
  Archive,
  CheckCircle2,
  Cpu
} from "lucide-react";

const TeamProjectHome = () => {
  useDocumentTitle({ title: 'Team Projects' });
  const { data, isLoading } = useGetTeamProjectsQuery(undefined);

  const projects = data?.data || [];
  const completedCount = projects.filter((p: projectType) => p.status === "complete").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Collective Force</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Team Labs</h1>
        </div>

        <Link
          to="/teamprojects/createnew"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Form New Team</span>
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900/40 border border-white/5 backdrop-blur-md rounded-xl">
          <Archive className="w-4 h-4 text-neutral-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{projects.length} Total</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 backdrop-blur-md rounded-xl">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Active Network</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{completedCount} Integrated</span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="relative">
        {isLoading && <ProjectCardsLoading />}

        {!isLoading && projects.length === 0 ? (
          <NoItemFound title="Project" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project: projectType, index: number) => (
              <ProjectCard
                time={100 * index}
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamProjectHome;
