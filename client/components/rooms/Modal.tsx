import { Main, Button } from './styles/Modal';

export default function Modal({ handleClose, show, children }): JSX.Element {
  const isHidden: string = !show ? 'hidden' : 'modal';

  return (
    <div className={isHidden}>
      <Main>
        <Button onClick={handleClose}>X</Button>

        {children}
      </Main>

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width:100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .hidden { display: none; }
      `}</style>
    </div>
  );
}