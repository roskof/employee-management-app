import {css} from 'lit';

export const styles = css`
  :host {
    display: block;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    margin: 0 auto;
    max-width: 1440px;
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    height: 20px;
    width: auto;
  }

  .title {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }

  .employees-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ff6200;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
  }

  .add-new-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: #ff6200;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .add-new-btn:hover {
    background: rgba(255, 98, 0, 0.1);
    border-radius: 4px;
  }

  .search-container {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 280px;
    display: none;
    border: 1px solid #eaeaea;
    box-sizing: border-box;
  }

  .search-container.active {
    display: block;
    animation: slideDown 0.2s ease-out;
  }

  .search-input {
    width: calc(100% - 24px);
    padding: 10px 36px 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .search-input:focus {
    outline: none;
    border-color: #ff6200;
    box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
