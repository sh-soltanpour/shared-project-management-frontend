import React, { Component } from 'react';
import './hero.scss';

export default class Hero extends Component<Props, State> {
  submitSearchProjects = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.props.onSearch(this.state.inputText);
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      inputText: ''
    };
  }
  onChangeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inputText: event.target.value });
  };
  render() {
    return (
      <div>
        <section id="slider">
          <div className="slider-container container">
            <h1>Shared Project Management</h1>

            <form className="main-search-box" onSubmit={this.submitSearchProjects}>
              <input type="text" placeholder="search projects" onChange={this.onChangeInput} />
              <button  type="submit"> Search

                  </button>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

interface Props {
  onSearch: (searchInput: string) => void;
}
interface State {
  inputText: string;
}
