import React, {Component} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {ButtonIcon, fallDownAnimation} from "./global-styles";
import {release} from "os";
import GoeyFilter from "./goey-filter";
import Connections from "./connections";

const GitFlowElm = styled.div`
`;

const ProjectElm = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 90px 1fr;
    margin-top: 20px;
    background: linear-gradient(135deg, rgba(34,52,122,1) 0%,rgba(23,35,82,1) 100%);
    border-radius: 5px;
    box-shadow: 0 4px 10px #9d9d9d;
`;

const GridColumn = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: ${p => `repeat(${p.count || 2}, 90px)`};
`;


const BranchHeader = styled.div`
    max-width: 90px;
    padding: 5px;
    text-align: center;
    background-color: #131d45;
    border-right: 1px solid #1b295f;
    color: #f0f0f0;
    z-index: 1;
    margin-bottom: 10px;
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
    opacity: .6;
`;

const Commits = styled.ol`
    position: relative;
    min-height: 500px;
    height: ${p => p.height || '500px'};
    filter: url('#goo');
    z-index: 20;
    border-right: 1px solid #1b295f;
    &:before {
        position: absolute;
        display: block;
        content: '';
        height: 100%;
        border: 1px dashed #2a3f94;
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
    transform: translate(-50%,-45px);
    background-color: ${p => p.color || '#9d9d9d'};
    border: 2px solid #333;
    animation: ${fallDownAnimation} cubic-bezier(0.770, 0.000, 0.175, 1.000) 1s;
    animation-fill-mode: forwards;
    z-index: 40;
`;

const ConnectionsContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 30;
`;

class GitFlow extends Component {

    componentWillMount() {
        this.commitPositions = {};
    }

    componentDidMount() {
        this.connectCommits();
    }

    componentDidUpdate() {
        this.connectCommits();
    }

    cacheConnectionsContainer = (elm) => {
        this.connectionsContainer = elm;
    };

    storeCommitPosition = (id, offset = 0, commitElm) => {
        if (commitElm) {
            this.commitPositions[id] = {
                top: commitElm.offsetTop,
                left: (offset * 90) + commitElm.offsetLeft
            }
        }
    };

    connectCommits = () => {
        const {commits} = this.props.project;
        let paths = commits.map(commit => {
            const {parents} = commit;
            const tgtPosition = this.commitPositions[commit.id];
            return (parents || []).map(p => {
                return {
                    src: this.commitPositions[p],
                    tgt: tgtPosition
                }
            });
        });
        paths = [].concat.apply([], paths);
        ReactDOM.render(<Connections paths={paths}/>, this.connectionsContainer);
    };

    renderCommitButton = (branch) => {
        return (
            <ButtonIcon
                onClick={this.props.onCommit.bind(this, branch.id, 0)}
            >+</ButtonIcon>
        )
    };

    renderDevelopBranchHeader = (branch) => {
        return (
            <BranchHeader>
                <BranchName>{branch.name}</BranchName>
                <BranchActions
                    count={3}
                >
                    <ButtonIcon onClick={this.props.onNewRelease}>R</ButtonIcon>
                    {this.renderCommitButton(branch)}
                    <ButtonIcon onClick={this.props.onNewFeature}>F</ButtonIcon>
                </BranchActions>
            </BranchHeader>
        )
    };

    renderFeatureBranchHeader = (branch) => {
        return (
            <BranchHeader
                key={branch.id}
            >
                <BranchName>{branch.name}</BranchName>
                <BranchActions
                    count={2}
                >
                    {this.renderCommitButton(branch)}
                    <ButtonIcon
                        onClick={this.props.onMerge.bind(this, branch.id, undefined)}
                    >M</ButtonIcon>
                </BranchActions>
            </BranchHeader>
        )
    };

    renderReleaseBranchHeader = (branch) => {
        return (
            <BranchHeader
                key={branch.id}
            >
                <BranchName>{branch.name}</BranchName>
                <BranchActions
                    count={2}
                >
                    {this.renderCommitButton(branch)}
                    <ButtonIcon
                        onClick={this.props.onRelease.bind(this, branch.id, undefined)}
                    >R</ButtonIcon>
                </BranchActions>
            </BranchHeader>
        )
    };

    renderMasterBranchHeader = (branch) => {
        return (
            <BranchHeader>
                <BranchName>{branch.name}</BranchName>
                <BranchActions/>
            </BranchHeader>
        )
    };

    renderBranchHeaders = (param) => {
        const {
            masterBranch,
            developBranch,
            releaseBranches,
            featureBranches,
            noOfBranches
        } = param;
        return (
            <GridColumn
                count={noOfBranches}
            >
                {
                    this.renderMasterBranchHeader(masterBranch)
                }
                {
                    releaseBranches.map(b => this.renderReleaseBranchHeader(b))
                }
                {
                    this.renderDevelopBranchHeader(developBranch)
                }
                {
                    featureBranches.map(b => this.renderFeatureBranchHeader(b))
                }
            </GridColumn>
        )
    };

    renderBranchCommits = (param) => {
        const {
            masterBranch,
            developBranch,
            releaseBranches,
            featureBranches,
            noOfBranches
        } = param;
        let branches = [masterBranch, ...releaseBranches, developBranch, ...featureBranches];
        return (
            <GridColumn
                count={noOfBranches}
            >
                <ConnectionsContainer innerRef={this.cacheConnectionsContainer}/>
                {
                    branches.map((branch, index) => {
                        return this.renderBranchCommit(branch, index)
                    })
                }
            </GridColumn>
        )
    };

    renderBranchCommit = (branch, branchIndex) => {
        const {commits} = this.props.project;
        const branchCommits = commits.filter(c => c.branch === branch.id);
        return (
            <Commits
                color={branch.color}
                key={'branch-' + branch.id}
                height={(branchCommits.length * 45) + 'px'}
            >
                {
                    branchCommits.map((commit) => {
                        return <Commit
                            innerRef={this.storeCommitPosition.bind(this, commit.id, branchIndex)}
                            key={'commit-' + commit.id}
                            color={branch.color}
                            top={commit.gridIndex - 1}
                        />
                    })
                }
            </Commits>
        )
    };

    render() {

        const {project} = this.props;
        const {branches} = project;
        const masterBranch = branches.find(b => b.name === 'master');
        const developBranch = branches.find(b => b.name === 'develop');
        const releaseBranches = branches.filter(b => b.releaseBranch);
        const featureBranches = branches.filter(b => b.featureBranch);
        const noOfBranches = 2 + releaseBranches.length + featureBranches.length;
        const param = {
            masterBranch,
            developBranch,
            featureBranches,
            releaseBranches,
            noOfBranches
        };
        return (
            <GitFlowElm>
                <ProjectElm>
                    {this.renderBranchHeaders(param)}
                    {this.renderBranchCommits(param)}
                </ProjectElm>
                <GoeyFilter/>
            </GitFlowElm>
        )
    }
}

export default GitFlow;
