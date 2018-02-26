import React, { Component } from 'react';
import styled from "styled-components";
import GitFlow from "./gitflow";
import shortid from "shortid";

const DEVELOP = 'develop';
const MASTER = 'master';

const offsetReducer = (acc, curr) => (1 + acc + curr.offset || 0);

const seedData = () => {
  const masterID = shortid.generate();
  const developID = shortid.generate();

  const commits = [
    {
      id: shortid.generate(),
      branch: masterID,
      gridIndex: 1,
    },
    {
      id: shortid.generate(),
      branch: developID,
      gridIndex: 1,
    }
  ]
  return {
    branches: [
      {
        name: MASTER,
        id: masterID,
        canCommit: false,
        color: '#BA68C8',
      },
      {
        name: DEVELOP,
        id: developID,
        canCommit: true,
        color: '#FF8A65',
      }
    ],
    commits
  }
};

const AppElm = styled.main`
  text-align: center;
  padding: 10px;
`;

class App extends Component {

  state = {
    project: seedData()
  }

  handleCommit = (branchID, mergeGridIndex = 0) => {
    let { commits } = this.state.project;
    const branchCommits = commits.filter(c => c.branch === branchID);
    const lastCommit = branchCommits[branchCommits.length - 1];
    commits.push({
      id: shortid.generate(),
      branch: branchID,
      gridIndex: lastCommit.gridIndex + mergeGridIndex + 1
    });
    this.setState({
      commits
    });
  };

  handleNewFeature = () => {
    let { branches, commits } = this.state.project;
    let featureBranches = branches.filter(b => !!b.featureBranch);
    let featureBranchName = 'feature ' + ((featureBranches || []).length + 1);
    let developBranch = branches.find(b => b.name === DEVELOP);
    let developCommits = commits.filter(c => c.branch === developBranch.id);
    const lastDevelopCommit = developCommits[developCommits.length - 1];
    let featutreOffset = lastDevelopCommit.gridIndex + 1;
    let newBranch = {
      id: shortid.generate(),
      name: featureBranchName,
      featureBranch: true,
      canCommit: true,
    };
    let newCommit = {
      id: shortid.generate(),
      branch: newBranch.id,
      gridIndex: featutreOffset
    };

    commits.push(newCommit);
    branches.push(newBranch);

    this.setState({
      branches,
      commits
    })
  };

  render() {
    return (
      <AppElm>
        <GitFlow
          project={this.state.project}
          onCommit={this.handleCommit}
          onNewFeature={this.handleNewFeature}
        />
      </AppElm>
    );
  }
}

export default App;
