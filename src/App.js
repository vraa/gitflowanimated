import React, { Component } from 'react';
import styled from "styled-components";
import GitFlow from "./gitflow";
import shortid from "shortid";

const DEVELOP = 'develop';
const MASTER = 'master';

const offsetReducer = (acc, curr) => (1 + acc + curr.offset || 0);
const masterID = shortid.generate();
const developID = shortid.generate();

const seedData = () => {

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
        let developCommits = commits.filter(c => c.branch === developID);
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
        });
    };

    handleNewRelease = () => {
        let { branches, commits } = this.state.project;
        let releaseBranches = branches.filter(b => !!b.releaseBranch);
        let releaseBranchName = 'release ' + ((releaseBranches || []).length + 1);
        let developCommits = commits.filter(c => c.branch === developID);
        const lastDevelopCommit = developCommits[developCommits.length - 1];
        let releaseOffset = lastDevelopCommit.gridIndex + 1;
        let newBranch = {
            id: shortid.generate(),
            name: releaseBranchName,
            releaseBranch: true,
            canCommit: true,
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: releaseOffset
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            branches,
            commits
        });
    };

    handleRelease = (sourceBranchID) => {
        const { branches, commits } = this.state.project;
        const sourceBranch = branches.find(b => b.id === sourceBranchID);
        const sourceCommits = commits.filter(c => c.branch === sourceBranchID);

        const masterCommits = commits.filter(c => c.branch === masterID);
        const developCommits = commits.filter(c => c.branch === developID);
        const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
        const lastMasterCommit = masterCommits[masterCommits.length - 1];
        const lastDevelopCommit = developCommits[developCommits.length - 1];

        const masterMergeCommit = {
            id: shortid.generate(),
            branch: masterID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastMasterCommit.gridIndex) + 1
        };

        const developMergeCommit = {
            id: shortid.generate(),
            branch: developID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastDevelopCommit.gridIndex) + 1
        };

        commits.push(masterMergeCommit, developMergeCommit);
        sourceBranch.merged = true;

        this.setState({ branches, commits });

    };

    handleMerge = (sourceBranchID, targetBranchID = developID) => {
        const { branches, commits } = this.state.project;

        const sourceBranch = branches.find(b => b.id === sourceBranchID);
        const sourceCommits = commits.filter(c => c.branch === sourceBranchID);
        const targetCommits = commits.filter(c => c.branch === targetBranchID);

        const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
        const lastTargetCommit = targetCommits[targetCommits.length - 1];

        const mergeCommit = {
            id: shortid.generate(),
            branch: targetBranchID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastTargetCommit.gridIndex) + 1
        };
        commits.push(mergeCommit);

        sourceBranch.merged = true;

        this.setState({
            branches,
            commits
        });
    }

    render() {
        return (
            <AppElm>
                <GitFlow
                    project={this.state.project}
                    onMerge={this.handleMerge}
                    onRelease={this.handleRelease}
                    onCommit={this.handleCommit}
                    onNewFeature={this.handleNewFeature}
                    onNewRelease={this.handleNewRelease}
                />
            </AppElm>
        );
    }
}

export default App;
