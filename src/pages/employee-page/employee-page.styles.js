import {css} from 'lit';

export const styles = css`
  :host {
    display: block;
    height: 100vh;
    font-family: Inter, system-ui, sans-serif;
    box-sizing: border-box;
    overflow: hidden;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 1440px;
    margin: 0 auto;
    overflow: hidden;
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    overflow: hidden;
  }

  .view-content {
    flex: 1;
    overflow: auto;
    margin: 10px 0;
  }

  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }

  .view-options {
    display: flex;
    gap: 10px;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    transition: color 0.2s ease;
  }

  button.active {
    color: #ff6b00;
  }

  app-pagination {
    padding: 16px 0;
  }
`;
