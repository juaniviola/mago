import styled from 'styled-components';

export const Main = styled.section`
  position:fixed;
  background: white;
  width: 80%;
  height: auto;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
`;

export const Button = styled.button`
  float: right;
  margin: 5px 5px 0 0;
  background-color: white;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;
