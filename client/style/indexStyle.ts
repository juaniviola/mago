import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
`;

export const Main = styled.div`
  padding: 6%;
  background-color: white;
  border-radius: 10px;
  text-align: center;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
`;

export const Link = styled.a`
  text-decoration: none;
  padding: 5% 45%;
  border-radius: 5px;
  background-color: #0069ff;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;

  &:hover {
    cursor: pointer;
    background-color: #6aa7ff;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: 15%;
`;

export const Img = styled.img`
  margin-top: -80%;
`;

export const Input = styled.input`
  outline: none;
  border: 1px solid #e5e8ed;
  padding: 5%;
  font-size: 1.2rem;
  background-color: #f3f5f9;
  border-radius: 8px;
`;
