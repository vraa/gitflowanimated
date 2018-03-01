import React, {Component} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {ButtonIcon, fallDownAnimation, fadeIn} from "./global-styles";
import GoeyFilter from "./goey-filter";
import Connections from "./connections";

const GitFlowElm = styled.div`
    max-width: 600px;
    margin: 0 auto;
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
    animation: ${fadeIn} .5s ease-in;
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
    min-height: 800px;
    height: ${p => p.height || '500px'};
    filter: url('#goo');
    z-index: 40;
    border-right: 1px solid #1b295f;
    transition: opacity .5s;
`;

const Commit = styled.li`
    position: absolute;
    display: grid;
    align-items: center;
    justify-items: center;
    top: ${p => (p.top * 45) + 'px'};
    left: 50%;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    transform: translate(-50%,-45px);
    background-color: ${p => p.color || '#9d9d9d'};
    box-shadow: 0 0 20px #f0f0f0;
    border: 1px solid #fff;
    animation: ${fallDownAnimation} cubic-bezier(0.770, 0.000, 0.175, 1.000) 1s;
    animation-fill-mode: forwards;
    z-index: 40;
    transition: all .2s;
    &.merged {
        background-color: #fff;
        box-shadow: none;
        opacity: .5;
    }
`;

const Tag = styled.p`
    color: #fff;
    font-size: .7rem;
    letter-spacing: 1pt;
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
                    srcCommitID: p,
                    tgtCommitID: commit.id,
                    src: this.commitPositions[p],
                    tgt: tgtPosition
                }
            });
        });
        paths = [].concat.apply([], paths);
        ReactDOM.render(<Connections paths={paths}/>, this.connectionsContainer);
    };


    deleteBranch = (branchID) => {
        const {commits} = this.props.project;
        const commitsToDelete = commits.filter(c => c.branch === branchID).map(c => c.id);
        commitsToDelete.forEach(c => {
            delete this.commitPositions[c.id];
        });
        this.props.onDeleteBranch(branchID);
    };

    renderCommitButton = (branch) => {
        return (
            <ButtonIcon
                onClick={this.props.onCommit.bind(this, branch.id, 0)}
            >C</ButtonIcon>
        )
    };

    renderDeleteButton = (branch) => {
        return (
            <BranchActions count={1}>
                <ButtonIcon onClick={this.deleteBranch.bind(this, branch.id)}>✕</ButtonIcon>
            </BranchActions>
        )
    }

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
        let actionsElm = null;
        if (branch.merged) {
            actionsElm = this.renderDeleteButton(branch);
        } else {
            actionsElm = (
                <BranchActions
                    count={2}
                >
                    <ButtonIcon
                        onClick={this.props.onMerge.bind(this, branch.id, undefined)}
                    >M</ButtonIcon>
                    {this.renderCommitButton(branch)}
                </BranchActions>
            );
        }
        return (
            <BranchHeader
                key={branch.id}
            >
                <BranchName>{branch.name}</BranchName>
                {actionsElm}
            </BranchHeader>
        )
    };

    renderReleaseBranchHeader = (branch) => {
        let actionsElm = null;
        if (branch.merged) {
            actionsElm = this.renderDeleteButton(branch);
        } else {
            actionsElm = (<BranchActions
                    count={2}
                >
                    {this.renderCommitButton(branch)}
                    <ButtonIcon
                        onClick={this.props.onRelease.bind(this, branch.id, undefined)}
                    >M</ButtonIcon>
                </BranchActions>
            );
        }
        return (
            <BranchHeader
                key={branch.id}
            >
                <BranchName>{branch.name}</BranchName>
                {actionsElm}
            </BranchHeader>
        )
    };

    renderMasterBranchHeader = (branch) => {
        return (
            <BranchHeader>
                <BranchName>{branch.name}</BranchName>
                <BranchActions count={1}>
                    <ButtonIcon
                        onClick={this.props.onNewHotFix}
                    >H</ButtonIcon>
                </BranchActions>
            </BranchHeader>
        )
    };

    renderBranchHeaders = (param) => {
        const {
            masterBranch,
            developBranch,
            releaseBranches,
            featureBranches,
            hotFixBranches,
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
                    hotFixBranches.map(b => this.renderReleaseBranchHeader(b))
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
            hotFixBranches,
            noOfBranches
        } = param;
        let branches = [masterBranch, ...hotFixBranches, ...releaseBranches, developBranch, ...featureBranches];
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
        let isMasterBranch = branch.name === 'master';
        return (
            <Commits
                className={branch.merged ? 'merged' : ''}
                color={branch.color}
                key={'branch-' + branch.id}
                height={(branchCommits.length * 45) + 'px'}
            >
                {
                    branchCommits.map((commit, idx) => {
                        return <Commit
                            className={branch.merged ? 'merged' : ''}
                            innerRef={this.storeCommitPosition.bind(this, commit.id, branchIndex)}
                            key={'commit-' + commit.id}
                            color={branch.color}
                            top={commit.gridIndex - 1}
                        >
                            {isMasterBranch ? <Tag>{'v' + idx}</Tag> : null}
                        </Commit>
                    })
                }
            </Commits>
        )
    };

    render() {

        const {project} = this.props;
        const {branches} = project;
        const masterBranch = branches.find(b => b.name === 'master');
        const hotFixBranches = branches.filter(b => b.hotFixBranch);
        const developBranch = branches.find(b => b.name === 'develop');
        const releaseBranches = branches.filter(b => b.releaseBranch);
        const featureBranches = branches.filter(b => b.featureBranch);
        const noOfBranches = branches.length;
        const param = {
            masterBranch,
            hotFixBranches,
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
