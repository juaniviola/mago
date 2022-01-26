import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0;
  padding: 0;
  padding-top: 5%;
  min-height: 100vh;
  background-color: #f7f7f7;
`;

export const Button = styled.button`
  border: none;
  padding: 1% 3%;
  min-width: 30%;
  background-color: #0069ff;
  color: white;
  border-radius: 3px;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 2%;

  &:hover {
    cursor: pointer;
    background-color: #6aa7ff;
  }

  @media (max-width: 550px) {
    padding: 2% 5%;
    min-width: 50%;
  }
`;
