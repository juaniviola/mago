import styled from 'styled-components';

export const Stack = styled.div`
  text-align: center;
  margin-bottom: 3%;
`;

export const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  height: 225px;
  margin-bottom: 20px;

  ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
    border: 1px solid #d5d5d5;
  }

  ::-webkit-scrollbar-track {
    border-radius: 15px;
    background: #eeeeee;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 15px;
    background: #b0b0b0;
  }
`;

export const Img = styled.img`
  opacity: ${props => props.disabled ? '0.5' : '1'};

  &:hover {
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
    width: ${props => props.disabled ? '144px' : '150px'};
    height: ${props => props.disabled ? '200px' : '215px'};
  }
`;

export const ContainerTakeCard = styled.div`
  text-align: center;
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
