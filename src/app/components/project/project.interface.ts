import { subtaskType } from "./SubTaskCard";

export type participantType = {
    _id: string;
    name: string;
    imageUrl?: string;
    email?: string;
  };
export type projectType = {
    _id: string,
    name:string,
    description:string,
    type:string,
    totalTime:number,
    createdAt: string,
    updatedAt: string,
    user: string,
    status: string,
    deleting?: boolean,
    participants: participantType[],
    tasks: taskType[]
}

export type taskType = {
    _id:string,
    title:string,
    subtasks: subtaskType[],
    status: 'ideal' | 'running' | 'paused' | 'complete',
    time: {
        startTime:number,
        totalTime:number,
        isPaused:boolean
    },
    assignedTo: {_id:string, name:string, email:string},
    createdAt: string,
    updatedAt:string
}