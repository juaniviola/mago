import styled from 'styled-components';

export const H3 = styled.h3`
  margin-top: 1%;
  margin-bottom: 0;
`;

export const Container = styled.div`
  background: white;
  width: 50%;
  padding: 2% 10%;
  border-radius: 8px;
  margin-bottom: 1%;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
`;

export const Information = styled.div`
  display: flex;
  flex-directoin: row;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  margin-top: 5%;
`;

export const Button = styled.a`
  text-decoration: none;
  border: none;
  padding: 1% 5%;
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
`;
