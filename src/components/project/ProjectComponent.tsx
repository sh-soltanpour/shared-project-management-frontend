import React, {Component} from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import './project.scss';
import Project from '../../models/Project';
import Colab from '../../models/Colab';
import Api from '../../api/Api';
import {DateUtil} from '../../utils/DateUtil';
import SkillList from '../skillList/SkillList';
import {StringUtil} from '../../utils/StringUtil';
import SkillType from '../../enums/SkillType';

export default class ProjectComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      project: new Project(),
      now: new Date(),
      colabRequested: false,
      bidAmount: 0,
      colabs: []
    };
  }

  private deadlineRefresh = setInterval(() => {
    this.setState({...this.state, now: new Date()});
  }, 1000);

  componentWillMount() {
    if (!this.isLoggedIn())
      return;
    const projectId = this.props.match.params.projectId;
    Api.getProject(this.props.match.params.projectId).then(res => {
      this.setState({...this.state, project: res.data});
    })
      .catch(res => {

      })
    ;

    // Api.bidRequested(projectId).then(res => {
    //   this.setState({...this.state, bidRequested: res.data.bidRequested});
    // });
  }

  private projectExpired(): boolean {
    return this.state.project.deadline < this.state.now.getTime();
  }

  componentWillUnmount() {
    clearInterval(this.deadlineRefresh);
  }

  acceptColab = (colabId: string) => {
    Api.acceptColab(this.props.match.params.projectId, colabId).then(data => {
      Api.getProject(this.props.match.params.projectId).then(res => {
        this.setState({...this.state, project: res.data});
      })
    })
  }

  rejectColab = (colabId: string) => {
    Api.rejectColab(this.props.match.params.projectId, colabId).then(data => {
      Api.getProject(this.props.match.params.projectId).then(res => {
        this.setState({...this.state, project: res.data});
      })
    })
  }

  projectDeadline(): JSX.Element {
    return (<div></div>)
    if (!this.projectExpired()) {
      return (
        <li className="project-deadline">
          <i className="flaticon-deadline"/>
          <span className="ml-2 font-weight-bold">time</span>
          <span>{DateUtil.dateDifference(this.state.now, new Date(this.state.project.project.date_created!)).toPersianString()}</span>
        </li>
      );
    } else {
      return (
        <li className="project-deadline ended">
          <i className="flaticon-deadline"/>
          <span className="font-weight-bold">timeout</span>
        </li>
      );
    }
  }

  private changeBidAmount = (event: React.FormEvent<HTMLInputElement>) => {
    let newBidAmount = parseInt(event.currentTarget.value);
    this.setState({...this.state, bidAmount: newBidAmount});
  };
  private sendColabRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Api.colabRequest(this.props.match.params.projectId).then(res => {
        if (res)
          this.setState({...this.state, colabRequested: true})
      }
    );
  };

  discordLink(): JSX.Element{
    if (this.state.project.project.discordLink)
      return (
          <div className="discord-link">
            <a target="_blank" href={this.state.project.project.discordLink}>Join Discord</a>
          </div>
      )
    else
      return(<div></div>)
  }

  projectForm(): JSX.Element {
    let has_colab = this.state.project.colab !== null && this.state.project.colab !== undefined;
    // @ts-ignore
    if (has_colab) {
      // @ts-ignore
      const status: string = (this.state.project.colab!).status;
      if (status === "pending") {
        return (
            <div className="already-bid">
              <i className="ml-2"/>
              <span> Collaboration Request is Pending For Acceptance</span>
            </div>
        )
      }
      else if (status === "accept"){
          return (
              <div>
              <div className="bid-accepted">
                  <i className="flaticon-check-mark ml-2"/>
                  <span> Your Collaboration Request is Accepted!</span>
              </div>
                {this.discordLink()}
              </div>
          )
      }
      else {
        return (
            <div className="bid-rejected">
              <span> Your Collaboration Request is Rejected!</span>
            </div>
        )
      }
    }
    if (this.projectExpired()) {
      return (
        <div className="deadline-reached">
          <i className="flaticon-danger ml-2"/>
          <span>Time out</span>
        </div>
      );
    } else if (this.state.colabRequested) {
      return (
        <div className="already-bid">
          <i className="ml-2"/>
          <span>Collaboration Request is Pending For Acceptance</span>
        </div>
      );
    } else if (!this.state.project.is_owner) {
      return (
        <div>
          {/*<h4>Collaboration Request</h4>*/}
          <form onSubmit={this.sendColabRequest} className="bid-form">
            {/*<div className="input-wrapper">*/}
            {/*  <input type="number" onChange={this.changeBidAmount}*/}
            {/*         placeholder="پیشنهاد خود را وارد کنید"/>*/}
            {/*  <span className="bid-label">تومان</span>*/}
            {/*</div>*/}
            <button type="submit">Send Collaboration Request</button>
          </form>
        </div>
      );
    }
  }
  private isLoggedIn(): boolean {
    return localStorage.getItem("accessToken") !== null && localStorage.getItem("accessToken") !== undefined
  }
  render(): JSX.Element {
    if (!this.isLoggedIn()){
      return <Redirect to={"/login"}/>
    }
    if (!this.state.project.project){
      return<div></div>;
    }
    const {title, imageUrl, description} = this.state.project.project;
    return (
      <div>
        <section id="slider">
          <div className="slider-container container"/>
        </section>
        <div id="wrapper" className="container">
          <div className="project-container">
            <div className="d-flex">
              <div className="project-avatar">
                <img src={imageUrl} alt="Project Image"/>
              </div>
              <div className="project-content">
                <h3 className="project-name">{title}</h3>
                <ul className="project-info">
                  {this.projectDeadline()}
                  <li className="project-budget">
                    <span className="ml-2">{"University of Calgary"}</span>
                  </li>
                  <li className="project-budget">
                    <span className="ml-2">{"Computer Science"}</span>
                  </li>
                  <li className="project-budget">
                    <span className="ml-2">{"Dr Andrew Ng"}</span>
                  </li>
                  {this.projectExpired() &&
                  <li className="won-user">
                      <i className="flaticon-check-mark"/>
                      <span className="ml-2">برنده:</span>
                      <span>{this.getWinnerName()}</span>
                  </li>
                  }
                </ul>
                <div className="project-description">
                  <p>{description}</p>
                </div>
              </div>
            </div>

            <div className="project-skills">
              <h4 className="colab-req-title">Collaboration Requests</h4>
              { this.state.project.colabs &&
              <SkillList
                  acceptCallback={this.acceptColab}
                  rejectCallback={this.rejectColab}
                  projectId={this.state.project._id}
                  type={SkillType.simple}
                  skills={this.state.project.colabs}/>
              }
            </div>
            <div className="project-form">{this.projectForm()}</div>
            {this.state.project.is_owner && this.discordLink()}
          </div>
        </div>
      </div>
    );
  }

  private getWinnerName(): string {
    if (this.state.project.winner) {
      return this.state.project.winner.firstName + ' ' + this.state.project.winner.lastName;
    }
    return 'برنده ندارد';
  }
}

interface MatchParams {
  projectId: string;
}

interface Props extends RouteComponentProps<MatchParams> {
}

interface State {
  project: Project;
  now: Date;
  colabRequested: boolean;
  bidAmount: number;
  colabs: Colab[]
}
