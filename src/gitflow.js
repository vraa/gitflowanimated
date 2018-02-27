import React, {Component} from "react";
import styled from "styled-components";
import {ButtonIcon, fallDownAnimation} from "./global-styles";
import {release} from "os";
import GoeyFilter from "./goey-filter";

const GitFlowElm = styled.div`
`;

const ProjectElm = styled.div`
    display: grid;
    grid-template-columns: ${p => `repeat(${p.count || 2}, 90px)`};
    margin-top: 20px;

    &:after {
        content: "";
        display: table;
        clear: both;
    }
`;

const BranchElm = styled.div`
    position: relative;
    max-width: 90px;
    padding: 5px;
    background-color: #fafafa;
    text-align: center;
    z-index: 1;

    &:nth-child(even) {
        background-color: #f7f7f7;
    }
`;

const BranchActions = styled.div`
    display: grid;
    grid-template-columns: ${p => `repeat(${p.count || 1}, 1fr)`};
    margin-top: 10px;
    justify-items: center;
    height: 24px;
`;

const BranchName = styled.h4`
    position: relative;
    font-size: .7rem;
    text-transform: uppercase;
    letter-spacing:1.5pt;
    margin-top: 10px;
`;

const Commits = styled.ol`
    position: relative;
    margin-top: 20px;
    min-height: 500px;
    filter: url('#goo');
    &:before {
        position: absolute;
        display: block;
        content: '';
        height: 100%;
        border: 1px dashed ${p => p.color || '#000'};
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        z-index: 0;
    }
`;

const Commit = styled.li`
    position: absolute;
    top: ${p => (p.top * 45) + 'px'};
    left: 50%;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    transform: translate(-50%,0);
    background-color: ${p => p.color || '#9d9d9d'};
    border: 2px solid #333;
    animation: ${fallDownAnimation} cubic-bezier(0.770, 0.000, 0.175, 1.000) 1s;
    animation-fill-mode: forwards;
`;


class GitFlow extends Component {

    renderCommitButton = (branch) => {
        return (
            <ButtonIcon
                onClick={this.props.onCommit.bind(this, branch.id, 0)}
            >+</ButtonIcon>
        )
    };

    renderDevelopBranchActions = (branch) => {
        return (
            <BranchActions
                count={3}
            >
                <ButtonIcon onClick={this.props.onNewRelease}>R</ButtonIcon>
                {this.renderCommitButton(branch)}
                <ButtonIcon onClick={this.props.onNewFeature}>F</ButtonIcon>
            </BranchActions>
        )
    };

    renderFeatureBranchActions = (branch) => {
        return (
            <BranchActions
                count={2}
            >
                {this.renderCommitButton(branch)}
                <ButtonIcon
                    onClick={this.props.onMerge.bind(this, branch.id, undefined)}
                >M</ButtonIcon>
            </BranchActions>
        )
    };

    renderReleaseBranchActions = (branch) => {
        return (
            <BranchActions
                count={2}
            >
                {this.renderCommitButton(branch)}
                <ButtonIcon
                    onClick={this.props.onRelease.bind(this, branch.id, undefined)}
                >R</ButtonIcon>
            </BranchActions>
        )
    };

    renderMasterBranchActions = (branch) => {
        return (
            <BranchActions/>
        )
    };

    renderBranch = (branch) => {
        const {commits} = this.props.project;
        const branchCommits = commits.filter(c => c.branch === branch.id);
        let branchActionsElm = null;
        if (branch.name === 'master') {
            branchActionsElm = this.renderMasterBranchActions(branch);
        } else if (branch.name === 'develop') {
            branchActionsElm = this.renderDevelopBranchActions(branch);
        } else if (branch.featureBranch) {
            branchActionsElm = this.renderFeatureBranchActions(branch);
        } else if (branch.releaseBranch) {
            branchActionsElm = this.renderReleaseBranchActions(branch);
        }

        return (
            <BranchElm
                key={'branch-' + branch.id}
            >
                <BranchName>{branch.name}</BranchName>
                {branchActionsElm}
                <Commits
                    color={branch.color}
                >
                    {
                        branchCommits.map((commit) => {
                            return <Commit
                                key={'commit-' + commit.id}
                                color={branch.color}
                                top={commit.gridIndex - 1}
                            />
                        })
                    }
                </Commits>
            </BranchElm>
        )
    }

    render() {

        const {project} = this.props;
        const {branches} = project;
        const masterBranch = branches.find(b => b.name === 'master');
        const developBranch = branches.find(b => b.name === 'develop');
        const releaseBranches = branches.filter(b => b.releaseBranch);
        const featureBranches = branches.filter(b => b.featureBranch);
        const noOfBranches = 2 + releaseBranches.length + featureBranches.length;
        return (
            <GitFlowElm>
                <ProjectElm
                    count={noOfBranches}
                >
                    {this.renderBranch(masterBranch)}
                    {
                        releaseBranches.map((branch) => {
                            return this.renderBranch(branch)
                        })
                    }
                    {this.renderBranch(developBranch)}
                    {
                        featureBranches.map((branch) => {
                            return this.renderBranch(branch)
                        })
                    }
                </ProjectElm>
                <GoeyFilter/>
            </GitFlowElm>
        )
    }
}

export default GitFlow;
