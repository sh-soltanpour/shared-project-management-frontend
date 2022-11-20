import React, { Component } from 'react';
import SkillType from '../../enums/SkillType';
import './skillItem.scss';

export default class SkillItem extends Component<Props, State> {
  endorsedClass(): string {
    return this.props.type === SkillType.endorsed ? 'endorsed' : '';
  }

  get_buttons(): JSX.Element {
    if (this.props.status == "pending") {
        return (
            <div>
                <div className="remove-skill">Reject</div>
                <div className="skill-endorse">Accept</div>
            </div>
        );
    }
      else if (this.props.status === "reject"){
          return (
              <div className="remove-skill">Rejected</div>
          );
        }
        else if (this.props.status === "accept"){
            return (
                <div className="skill-endorse">Accepted</div>
            );
        }
        return (<div></div>);
    }

  render(): JSX.Element {
    return (
      <div onClick={() => this.props.onClick(this.props.name)} className={'skill-item ' + this.endorsedClass()}>
        <div className="skill-name">{this.props.name}</div>
        <div className="skill-name">{this.props.university}</div>
          {this.get_buttons()}
      </div>
    );
  }
}

interface Props {
  name: string;
  university: string;
  status: string;
  point: number;
  type: SkillType;
  onClick: (skillName: string) => void;
}

interface State {}
