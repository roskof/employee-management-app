import {css} from 'lit';

export const styles = css`
  :host {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    color: #ff6600;
  }

  .modal-body {
    padding: 15px 0;
    font-size: 16px;
  }

  .modal-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    width: 100%;
    transition: all 0.3s ease;
  }

  .cross {
    color: #ff6600;
    background-color: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
  }

  .btn.proceed {
    background-color: #ff6600;
    color: white;
  }

  .btn.proceed:hover {
    background-color: #ff8533;
  }

  .btn.cancel {
    background-color: #fff;
    color: black;
    border: 1px solid black;
  }

  .btn.cancel:hover {
    font-weight: bolder;
  }
`;
