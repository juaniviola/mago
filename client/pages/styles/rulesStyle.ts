import styled from 'styled-components';

export const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
  Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
  sans-serif;
`;

export const Sections = styled.div`
  margin-top: 3%;
`;

export const Link = styled.a`
  text-decoration: none;

  &:hover {
    color: grey;
    cursor: pointer;
  }
`;

export const SeparatorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LinkSeparator = styled.a`
  color: black;
  font-weight: bold;
  text-decoration: none;
  padding: 1% 5%;
  border-radius: 5px;
  border: 1px solid black;
  margin-bottom: 5px;

  &:hover {
    color: grey;
    cursor: pointer;
  }
`;
