import {css} from 'lit';

export const styles = css`
  :host {
    display: block;
    flex: 1;
    overflow: hidden;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .table-container {
    height: 100%;
    overflow: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f8f8f8;
  }

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: 500;
    color: #666;
  }

  tbody tr {
    height: 60px;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  .edit-btn,
  .delete-btn {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    transition: transform 0.2s;
    color: #ff6b00;
  }

  .edit-btn:hover,
  .delete-btn:hover {
    transform: scale(1.1);
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .selected-row {
    background-color: #e0f7ff;
  }
`;
