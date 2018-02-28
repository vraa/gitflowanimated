import React, {Component} from "react";
import styled, {keyframes} from "styled-components";

const ConnectionsElm = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
`;

const draw = keyframes`
    to {
        stroke-dashoffset: 0;   
    }
`;

const AnimatedLine = styled.line`
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: ${draw} 2s linear forwards;
`;

const AnimatedPath = styled.path`
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: ${draw} 2s linear forwards;
`;


class Connections extends Component {

    render() {
        const {paths} = this.props;
        return (
            <ConnectionsElm>
                {
                    paths.map((path, idx) => {
                        const {src, tgt} = path;
                        let elm = null;
                        if (src.left === tgt.left) {
                            elm = <AnimatedLine
                                key={'p' + src.left + '-' + src.top + '-' + idx}
                                x1={src.left} y1={src.top + 25} x2={tgt.left} y2={tgt.top}
                                fill={'none'}
                                stroke={'#3d3d3d'}
                                strokeWidth={2}
                            />
                        } else {
                            let p1, p2, c1, c2;
                            if (src.left < tgt.left) {
                                p1 = {
                                    x: src.left,
                                    y: src.top + 12.5
                                };
                                p2 = {
                                    x: tgt.left,
                                    y: tgt.top + 12.5
                                };
                                c1 = {
                                    x: p1.x + 45,
                                    y: p1.y
                                };
                                c2 = {
                                    x: p2.x - 45,
                                    y: p2.y
                                };
                            } else {
                                p1 = {
                                    x: src.left,
                                    y: src.top + 12.5
                                };
                                p2 = {
                                    x: tgt.left,
                                    y: tgt.top + 12.5
                                };
                                c1 = {
                                    x: p1.x - 45,
                                    y: p1.y
                                };
                                c2 = {
                                    x: p2.x + 45,
                                    y: p2.y
                                };
                            }

                            let pathStr = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
                            elm = <AnimatedPath
                                key={'p' + src.left + '-' + src.top + '-' + idx}
                                d={pathStr}
                                fill={'none'}
                                stroke={'#3d3d3d'}
                                strokeWidth={2}
                            />
                        }

                        return elm;
                    })
                }
            </ConnectionsElm>
        )
    }
}

export default Connections;