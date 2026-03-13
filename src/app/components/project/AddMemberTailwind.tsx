/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useLazySearchUsersQuery } from "../../redux/features/user/userApi";
import { participantType, projectType } from "./project.interface";
import { useParams } from "react-router-dom";
import { useAddMemberToProjectMutation, useGetMembersByProjectIdQuery } from "../../redux/features/project/project.api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CheckCircle, Search, UserPlus, Loader2, X, Users, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddMemberTailwind = ({ project }: { project: projectType }) => {
    const { participants: projectParticipants } = project;
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchText, setSearchText] = useState("");
    const [getSearchedUser, { data: searchData }] = useLazySearchUsersQuery();
    const { id: projectId } = useParams();

    const { data: membersData, isLoading: membersLoading } = useGetMembersByProjectIdQuery(projectId as string, {
        skip: !projectId,
    });

    function debounce(func: any, timeout = 500) {
        let timer: any;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, timeout);
        };
    }

    function saveInput() {
        if (searchRef.current) {
            setSearchText(searchRef.current.value);
        }
    }

    const processChange = debounce(() => saveInput());

    const [searchingUser, setSearchingUser] = useState(false);
    useEffect(() => {
        const handleLoadingState = async () => {
            setSearchingUser(true);
            await getSearchedUser(searchText);
            setSearchingUser(false);
        };
        if (searchText) {
            handleLoadingState();
        }
    }, [searchText, getSearchedUser]);

    const [searchResultHidden, setSearchResultHidden] = useState(true);
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setSearchResultHidden(true);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [addMember, { isLoading: addMemberLoading }] = useAddMemberToProjectMutation();
    const [addMemberId, setAddMemberId] = useState("");

    const handleAddMember = (member: participantType) => {
        setAddMemberId(member._id);
        const memberId = member._id;
        if (projectId) {
            addMember({ projectId, memberId });
        }
    };

    const [showMembersModal, setShowMembersModal] = useState(false);
    const user = useSelector((state: RootState) => state.user);

    return (
        <>
            {project.user === user.id && (
                <div className="flex items-stretch gap-3 w-full max-w-2xl">
                    <div className="shrink-0">
                        <button
                            onClick={() => setShowMembersModal(true)}
                            className="h-full px-4 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
                        >
                            <Users size={18} className="text-slate-500 group-hover:text-indigo-500 transition-colors" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Members</span>
                            <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50">
                                {projectParticipants.length}
                            </span>
                        </button>
                    </div>

                    <div className="relative flex-1" ref={componentRef}>
                        <div className="relative">
                            <input
                                ref={searchRef}
                                type="text"
                                autoComplete="off"
                                placeholder="Search member by name or email..."
                                onChange={processChange}
                                onFocus={() => setSearchResultHidden(false)}
                                className="w-full h-11 pl-10 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-sm placeholder:text-slate-400 dark:text-slate-200"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {searchingUser && (
                                    <Loader2 className="animate-spin text-indigo-500" size={18} />
                                )}
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {!searchResultHidden && searchText && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                                >
                                    <div className="max-h-[320px] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent pr-1">
                                        {searchData?.data && searchData.data.length > 0 ? (
                                            searchData.data.map((d: any) => (
                                                <div
                                                    key={d._id}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                            {d.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                            {d.email}
                                                        </p>
                                                    </div>

                                                    {projectParticipants.some((p) => (typeof p === 'string' ? p === d._id : p._id === d._id)) ? (
                                                        <div className="p-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                                                            <CheckCircle size={18} />
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAddMember(d)}
                                                            disabled={addMemberLoading && addMemberId === d._id}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-medium rounded-full transition-all shadow-sm hover:shadow active:scale-95"
                                                        >
                                                            {addMemberLoading && addMemberId === d._id ? (
                                                                <Loader2 className="animate-spin" size={14} />
                                                            ) : (
                                                                <UserPlus size={14} />
                                                            )}
                                                            Add
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            !searchingUser && (
                                                <div className="py-8 text-center">
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">No members found for "{searchText}"</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Members Modal */}
            <AnimatePresence>
                {showMembersModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMembersModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Project Members</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage people in this project</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowMembersModal(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
                                {membersLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                                        <p className="text-sm">Loading members...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {membersData?.data?.participants?.map((participant: participantType) => (
                                            <div
                                                key={participant._id}
                                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl"
                                            >
                                                <div className="h-10 w-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-sm">
                                                    {participant.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                        {participant.name}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                        <Mail size={12} />
                                                        <span className="truncate">{participant.email}</span>
                                                    </div>
                                                </div>
                                                <div className="px-2.5 py-1 bg-white dark:bg-slate-700 text-[10px] font-medium text-slate-500 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-600 uppercase tracking-wider">
                                                    Member
                                                </div>
                                            </div>
                                        ))}
                                        {(!membersData?.data?.participants || membersData.data.participants.length === 0) && (
                                            <div className="py-12 text-center text-slate-400">
                                                <Users className="mx-auto mb-3 opacity-20" size={48} />
                                                <p className="text-sm italic">No members added yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button
                                    onClick={() => setShowMembersModal(false)}
                                    className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AddMemberTailwind;
