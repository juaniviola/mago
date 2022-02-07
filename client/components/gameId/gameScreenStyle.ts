import styled from 'styled-components';

export const Stack = styled.div`
  text-align: center;
  margin-bottom: 3%;

  ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
    border: 1px solid #d5d5d5;
  }

  ::-webkit-scrollbar-track {
    border-radius: 0;
    background: #eeeeee;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    background: #b0b0b0;
  }
`;

export const Cards = styled.div`
  text-align: center;
  overflow: auto;
  white-space: nowrap;
  margin-bottom: 20px;
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
