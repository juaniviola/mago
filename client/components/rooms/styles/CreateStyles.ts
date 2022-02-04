import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  padding: 2% 5%;
  border-radius: 8px;
  text-align: center;
`;

export const Span = styled.span`
  font-weight: bold;
  font-size: 1.25rem;
`;

export const Input = styled.input`
  width: 100%;
  outline: none;
  padding: 1% 2%;
  background-color: #f3f5f9;
  border: 1px solid #e5e8ed;
  border-radius: 3px;
  font-weight: bold;
  font-size: 1rem;
  margin-right: 2%;
  margin-bottom: 2%;
`;

export const Button = styled.button`
  border: none;
  padding: 1% 2%;
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

export const Form = styled.form`
  width: 100%;
  margin-top: 5%;
  display: flex;
  flex-direction: row;
`;

export const FormColumn = styled.form`
  width: 100%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
`;
