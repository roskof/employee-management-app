import {css} from 'lit';

export const styles = css`
  .form-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .form-group {
    margin-bottom: 15px;
    color: #ff6b6b;
  }
  .form-group h2 {
    display: flex;
    justify-content: center;
  }
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  input,
  select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .error {
    color: red;
    font-size: 12px;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
  button {
    padding: 8px 16px;
    margin-left: 10px;
    background-color: #ff6600;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  .cancel-button {
    background-color: #fff;
    color: #ff6600;
    border: 1px solid #ff6600;
  }
`;
