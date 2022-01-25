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
  padding: 10% 20%;
  border-radius: 5px;
  background-color: #efefef;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;

  &:hover {
    background-color: grey;
    cursor: pointer;
  }
`;

export const Buttons = styled.div`
  margin-top: 25%;
`;

export const Img = styled.img`
  margin-top: -80%;
`;
