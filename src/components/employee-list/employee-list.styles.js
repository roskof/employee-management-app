import {css} from 'lit';

export const styles = css`
  .employee-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
    overflow-y: auto;
  }

  .employee-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    min-height: 90px;
  }

  .employee-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .employee-item.selected {
    border: 2px solid #4a90e2;
    background-color: #e0f7ff;
  }

  .employee-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    line-height: 1.4;
  }

  .employee-details div {
    color: #333;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .employee-details strong {
    font-size: 1.1rem;
    color: #1a1a1a;
    display: block;
  }

  .employee-actions {
    display: flex;
    gap: 0.5rem;
    margin-left: 1rem;
  }

  button {
    padding: 0.5rem;
    border: none;
    background: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff6b00;
  }

  .edit-btn:hover,
  .delete-btn:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    .employee-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .employee-actions {
      margin-top: 1rem;
      align-self: flex-end;
    }
  }
`;
