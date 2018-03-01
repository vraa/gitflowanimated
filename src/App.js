import React, {Component} from 'react';
import styled from "styled-components";
import GitFlow from "./gitflow";
import shortid from "shortid";

const DEVELOP = 'develop';
const MASTER = 'master';

const masterID = shortid.generate();
const developID = shortid.generate();

const seedData = () => {

    const commits = [
        {
            id: shortid.generate(),
            branch: masterID,
            gridIndex: 1,
            parents: null,
        },
        {
            id: shortid.generate(),
            branch: developID,
            gridIndex: 1,
            parents: null
        }
    ];
    return {
        branches: [
            {
                name: MASTER,
                id: masterID,
                canCommit: false,
                color: '#E040FB',
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
    };

    handleCommit = (branchID, mergeGridIndex = 0) => {
        let {commits} = this.state.project;
        const branchCommits = commits.filter(c => c.branch === branchID);
        const lastCommit = branchCommits[branchCommits.length - 1];
        commits.push({
            id: shortid.generate(),
            branch: branchID,
            gridIndex: lastCommit.gridIndex + mergeGridIndex + 1,
            parents: [lastCommit.id]
        });
        this.setState({
            commits
        });
    };

    handleNewFeature = () => {
        let {branches, commits} = this.state.project;
        let featureBranches = branches.filter(b => b.featureBranch);
        let featureBranchName = 'feature ' + ((featureBranches || []).length + 1);
        let developCommits = commits.filter(c => c.branch === developID);
        const lastDevelopCommit = developCommits[developCommits.length - 1];
        let featureOffset = lastDevelopCommit.gridIndex + 1;
        let newBranch = {
            id: shortid.generate(),
            name: featureBranchName,
            featureBranch: true,
            canCommit: true,
            color: '#64B5F6'
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: featureOffset,
            parents: [lastDevelopCommit.id]
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleNewHotFix = () => {
        let {branches, commits} = this.state.project;
        let hotFixBranches = branches.filter(b => b.hotFixBranch);
        let hotFixBranchName = 'hot ' + ((hotFixBranches || []).length + 1);
        let masterCommits = commits.filter(c => c.branch === masterID);
        const lastMasterCommit = masterCommits[masterCommits.length - 1];
        let hotFixOffset = lastMasterCommit.gridIndex + 1;

        let newBranch = {
            id: shortid.generate(),
            name: hotFixBranchName,
            hotFixBranch: true,
            canCommit: true,
            color: '#ff1744'
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: hotFixOffset,
            parents: [lastMasterCommit.id]
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleNewRelease = () => {
        let {branches, commits} = this.state.project;
        let releaseBranches = branches.filter(b => b.releaseBranch);
        let releaseBranchName = 'release ' + ((releaseBranches || []).length + 1);
        let developCommits = commits.filter(c => c.branch === developID);
        const lastDevelopCommit = developCommits[developCommits.length - 1];
        let releaseOffset = lastDevelopCommit.gridIndex + 1;
        let newBranch = {
            id: shortid.generate(),
            name: releaseBranchName,
            releaseBranch: true,
            canCommit: true,
            color: '#B2FF59'
        };
        let newCommit = {
            id: shortid.generate(),
            branch: newBranch.id,
            gridIndex: releaseOffset,
            parents: [lastDevelopCommit.id]
        };
        commits.push(newCommit);
        branches.push(newBranch);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleRelease = (sourceBranchID) => {
        let {branches, commits} = this.state.project;
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
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastMasterCommit.gridIndex) + 1,
            parents: [lastMasterCommit.id, lastSourceCommit.id]
        };

        const developMergeCommit = {
            id: shortid.generate(),
            branch: developID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastDevelopCommit.gridIndex) + 1,
            parents: [lastDevelopCommit.id, lastSourceCommit.id]
        };

        commits.push(masterMergeCommit, developMergeCommit);
        sourceBranch.merged = true;

        this.setState({
            project: {
                branches,
                commits
            }
        });

    };

    handleMerge = (sourceBranchID, targetBranchID = developID) => {
        let {branches, commits} = this.state.project;

        const sourceBranch = branches.find(b => b.id === sourceBranchID);
        const sourceCommits = commits.filter(c => c.branch === sourceBranchID);
        const targetCommits = commits.filter(c => c.branch === targetBranchID);

        const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
        const lastTargetCommit = targetCommits[targetCommits.length - 1];

        const mergeCommit = {
            id: shortid.generate(),
            branch: targetBranchID,
            gridIndex: Math.max(lastSourceCommit.gridIndex, lastTargetCommit.gridIndex) + 1,
            parents: [lastSourceCommit.id, lastTargetCommit.id]
        };
        commits.push(mergeCommit);

        sourceBranch.merged = true;

        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

    handleDeleteBranch = (branchID) => {
        let {branches, commits} = this.state.project;

        let commitsToDelete = commits.filter(c => c.branch === branchID);
        let lastCommit = commitsToDelete[commitsToDelete.length - 1];
        commits = commits.map(commit => {
            if (commit.parents) {
                commit.parents = commit.parents.filter(pID => pID !== lastCommit.id);
            }
            return commit;

        });
        branches = branches.filter(b => b.id !== branchID);
        commits = commits.filter(c => c.branch !== branchID);
        this.setState({
            project: {
                branches,
                commits
            }
        });
    };

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
                    onDeleteBranch={this.handleDeleteBranch}
                    onNewHotFix={this.handleNewHotFix}
                />
            </AppElm>
        );
    }
}

export default App;
