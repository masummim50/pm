import JournalOverview from "./JournalOverviewTailwind";
import PersonalProjectOverview from "./PersonalProjectOverviewTailwind";
import TodoOverview from "./TodoOverviewTailwind";
import TeamProjectOverview from "./TeamProjectOverviewTailwind";
import useDocumentTitle from "../../../UseDocumentTitle";
import { useEffect, useState } from "react";
import { useGetLastTodosQuery, useGetTodosQuery } from "../../redux/features/todo/todo.api";
import { useGetPersonalProjectsQuery, useGetTeamProjectsQuery } from "../../redux/features/project/project.api";
import { formatDataArray } from "../../lib/dateFunctions";
import { Sparkles } from "lucide-react";

const ProfileTailwind = () => {
    useDocumentTitle({ title: 'Dashboard | Profile' })
    const [showRandom, setShowRandom] = useState(true);

    const { data, isLoading, isSuccess } = useGetLastTodosQuery(undefined);
    const { data: allTodosData, isLoading: isAllLoading } = useGetTodosQuery(undefined);
    const { data: allProjectsData, isLoading: isProjectsLoading } = useGetPersonalProjectsQuery(undefined);
    const { data: teamProjectsData, isLoading: isTeamLoading } = useGetTeamProjectsQuery(undefined);

    const [dates, setDates] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([]);
    const [randomValue] = useState<number[]>(() =>
        Array.from({ length: 30 }, () => Math.floor(Math.random() * 21))
    );
    useEffect(() => {
        if (data?.data?.lastdays) {
            const { dates, values } = formatDataArray(data?.data?.lastdays);

            setDates(dates);
            if (showRandom) {
                setValues(randomValue);
            } else {
                setValues(values);
            }
        }
    }, [data, showRandom]);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Project Health <Sparkles className="w-6 h-6 text-blue-400" />
                    </h1>
                    <p className="text-neutral-500 mt-1">Overview of your productivity and project progress</p>
                </div>

                <div className="flex items-center gap-3">
                    {isSuccess && (
                        <button
                            onClick={() => setShowRandom(!showRandom)}
                            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition-all border border-neutral-800 rounded-xl hover:border-neutral-700 shadow-sm"
                        >
                            {showRandom ? "Show real data" : "Show fake data"}
                        </button>
                    )}
                </div>
            </div>

            <TodoOverview
                isLoading={isLoading || isAllLoading}
                dates={dates}
                values={values}
                allTodos={allTodosData?.data}
            />
            <PersonalProjectOverview
                isLoading={isProjectsLoading}
                showRandom={showRandom}
                allProjects={allProjectsData?.data}
            />
            <TeamProjectOverview
                isLoading={isTeamLoading}
                allTeamProjects={teamProjectsData?.data}
            />
            <JournalOverview />
        </div>
    );
};

export default ProfileTailwind;
