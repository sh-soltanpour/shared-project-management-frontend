import axios, {AxiosPromise} from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import BidRequestedResponse from '../models/BidRequestedResponse';
import Project from '../models/Project';
import ProjectListItem from '../models/ProjectListItem';
import ProjectSkill from '../models/ProjectSkill';
import User from '../models/User';
import UserListItem from '../models/UserListItem';
import ToastUtil from '../utils/ToastUtil';
import LoginResponse from '../models/LoginResponse';

class ApiClass {
  private axiosInstance = axios.create({
    // baseURL: 'http://localhost:8080/neyanboon'
    // baseURL: 'http://localhost:3001'
    baseURL: 'https://afb7-136-159-213-149.ngrok.io'
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(
      config => {
        if (config.url && (config.url.includes("/login") || config.url.includes("/register")))
          return config;
        config.headers["Authorization"] = "Bearer " + localStorage.getItem("accessToken");
        config.headers["ngrok-skip-browser-warning"] = "any"

        return config;
      },
      error => Promise.reject(error)
    );
    this.axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error == 'Error: Network Error') {
          ToastUtil.error('No Internet Connection');
        }
        else if (error.response.status === 403 && !error.response.data){
          localStorage.clear();
          window.location.pathname = "/login"
        }
        else if (error.response.data.message === 'Entered amount is not valid') {
          ToastUtil.error('مقدار وارد شده از سقف پروژه بیشتر است');
        } else if (error.response.data.message === 'Access Denied') {
          ToastUtil.error('شما اجازه دسترسی به این صفحه را ندارید');
        }

      }
    );
  }

  searchProjects(searchTerm: string) {
    return this.axiosInstance.get<ProjectListItem[]>('/projects/search', {params: {q: searchTerm}});
  }

  searchUsers(searchTerm: string) {
    return this.axiosInstance.get<UserListItem[]>('/users/search', {params: {q: searchTerm}});
  }

  getAllUsers() {
    return this.axiosInstance.get<UserListItem[]>('/users');
  }

  getAllProjects(pageSize: number, pageNumber: number) {
    return this.axiosInstance.get<ProjectListItem[]>('/projects');
  }

  getProject(projectId: string): AxiosPromise<Project> {
    return this.axiosInstance.get<Project>(`/projects/${projectId}`);
  }

  bidRequested(projectId: string): AxiosPromise<BidRequestedResponse> {
    return this.axiosInstance.get<BidRequestedResponse>(`/projects/bids?projectId=${projectId}`);
  }

  colabRequest(projectId: string): AxiosPromise<Project> {
    return this.axiosInstance.post<Project>(`/projects/${projectId}/colabs`, {});
  }

  getUser(userId: string): AxiosPromise<User> {
    return this.axiosInstance.get<User>(`/users/${userId}`);
  }

  deleteSkill(skillName: string): AxiosPromise<ProjectSkill[]> {
    const data = {name: skillName};
    return this.axiosInstance.delete('/users/skills', {data: data});
  }

  endroseSkill(skillName: string, endorsedUserId: string): AxiosPromise<ProjectSkill[]> {
    const data = {
      endorsedUser: {
        id: endorsedUserId
      },
      skill: {
        name: skillName
      }
    };
    return this.axiosInstance.post<ProjectSkill[]>('/users/skills/endorses', data);
  }

  getAllSkills(): AxiosPromise<ProjectSkill[]> {
    return this.axiosInstance.get<ProjectSkill[]>('/skills');
  }

  addSkill(skillName: string): AxiosPromise<ProjectSkill[]> {
    const data = {name: skillName};
    return this.axiosInstance.post<ProjectSkill[]>('/users/skills', data);
  }

  login(username: string, password: string): AxiosPromise<LoginResponse> {
    const data = {email: username, password};
    return this.axiosInstance.post<LoginResponse>('/auth/login', data);
  }

  register(firstName: string, lastName: string, bio: string, profilePictureUrl: string, jobTitle: string, password: string,
           email: string): AxiosPromise<{}> {
    const data = {
      firstName, lastName, bio, profilePictureUrl, jobTitle, password, email
    };
    return this.axiosInstance.post<{}>('/auth/register', data);
  }
}

const Api = new ApiClass();
export default Api;
