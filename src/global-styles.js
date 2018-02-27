import styled, { injectGlobal } from 'styled-components';

injectGlobal`
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
    display: block;
    }
    body {
    line-height: 1;
    }
    ol, ul {
    list-style: none;
    }
    blockquote, q {
    quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
    content: '';
    content: none;
    }
    table {
    border-collapse: collapse;
    border-spacing: 0;
    }

    html {
        box-sizing: border-box;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }


    body {
        background-color: #fff;
        color: #3d3d3d;
        font-family: 'Open Sans', sans-serif;
        font-size: 1em;

    }
`;

export const FlowName = styled.h2`
    font-weight: bold;
    font-size: 1.2rem;
`;

export const FlowActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
  margin-top: 10px;
`;

export const Button = styled.button`
  border: none;
  background: transparent;
  border: 1px solid #2196F3;
  color: #2196F3;
  border-radius: 20px;
  padding: 10px;
`;

export const ButtonIcon = styled.button`
  width: 24px;
  height: 24px;
  background: transparent;
  background: transparent;
  border: 1px solid #2196F3;
  color: #2196F3;
  border-radius: 50%;
`;
