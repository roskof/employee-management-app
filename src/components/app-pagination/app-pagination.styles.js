import {css} from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
  }

  button {
    background: none;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    min-width: 10px;
    transition: all 0.2s;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.active {
    background-color: #ff6b00;
    color: white;
    border-color: #ff6b00;
    border-radius: 9999px;
  }

  button:not(:disabled):hover {
    background-color: #f5f5f5;
  }

  button.active:hover {
    background-color: #e66000;
  }

  .ellipsis {
    padding: 0 4px;
  }
`;
