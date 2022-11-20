import React, { Component } from 'react';
import SkillType from '../../enums/SkillType';
import ProjectSkill from '../../models/ProjectSkill';
import './skillList.scss';
import SkillItem from '../skillItem/SkillItem';
import Colab from "../../models/Colab";

export default class SkillList extends Component<Props, {}> {
  static defaultProps = {
    type: SkillType.pending,
    onDelete: (skillName: string) => {},
    onEndorse: (skillName: string) => {}
  };

  private getSkillType(skill: Colab): SkillType {
    return SkillType.endorsed;
    if (this.props.type === SkillType.deletable || this.props.type === SkillType.simple) return this.props.type;
    return skill.endorsed ? SkillType.endorsed : SkillType.endorsable;
  }

  private getOnClick(skill: ProjectSkill): (skillName: string) => void {
    switch (this.getSkillType(skill)) {
      case SkillType.deletable:
        return this.props.onDelete;
      case SkillType.endorsable:
        return this.props.onEndorse;
      default:
        return (skillName: string) => {};
    }
  }

  render(): JSX.Element {
    return (
      <ul className="skills-list">
        {this.props.skills.map(skill => (
          <li key={skill.status}>
            <SkillItem
                key={skill._id}
                acceptCallback={this.props.acceptCallback}
                rejectCallback={this.props.rejectCallback}
                projectId={this.props.projectId} colabId={skill._id} name={skill.creator_name} status={skill.status} university={skill.creator_university} point={123} type={this.getSkillType(skill)} onClick={this.getOnClick(skill)} />
          </li>
        ))}
      </ul>
    );
  }
}

interface Props {
  skills: Colab[];
  acceptCallback: (arg: string)=>(void);
  rejectCallback: (arg: string)=>(void);
  projectId: string;
  type: SkillType;
  onEndorse: (skillName: string) => void;
  onDelete: (skillName: string) => void;
}
