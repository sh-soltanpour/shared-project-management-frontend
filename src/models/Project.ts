import ProjectSkill from './ProjectSkill';
import User from './User';
import Colab from "./Colab";

export default class Project {
    _id: string = '';
    title: string = '';
    colab: Colab | null = null;
    colabs: Colab[] = [];
    is_owner: boolean = false;
    skills: ProjectSkill[] = [];
    status: string = '';
    date_created: Date | null = null;
    imageUrl: string = '';
    budget: number = 0;
    description: string = '';
    deadline: number = 0;
    winner: User | null = null
}
