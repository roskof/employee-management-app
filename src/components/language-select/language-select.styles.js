import {css} from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    position: relative;
  }

  .container {
    position: relative;
  }

  .language-flag {
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  }

  .flag-img {
    width: 24px;
    height: 18px;
    border-radius: 2px;
    object-fit: cover;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: -4px;
    display: none;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    padding: 4px;
    min-width: 40px;
  }

  .container:hover .dropdown {
    display: flex;
  }

  .dropdown-item {
    padding: 4px 8px;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 4px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }

  .dropdown-item:hover {
    background-color: rgba(240, 240, 240, 0.5);
  }
`;
