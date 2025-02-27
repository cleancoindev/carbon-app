import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Overlay } from 'libs/modals/Overlay';
import { ModalProps } from 'libs/modals/modals.types';

const getSize = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return 'max-w-[580px]';
    case 'md':
      return 'max-w-[480px]';
    default:
      return 'max-w-[380px]';
  }
};

export const Modal: FC<ModalProps> = ({
  children,
  id,
  title,
  size = 'sm',
  showCloseButton = true,
  isLoading = false,
  onClose,
}) => {
  const { closeModal } = useModal();

  const onCloseHandler = (id: string) => {
    onClose && onClose(id);
    closeModal(id);
  };

  const sizeClass = getSize(size);

  return (
    <Overlay
      onClick={() => onCloseHandler(id)}
      className={'px-content items-center justify-center'}
    >
      <m.div
        onClick={(e) => e.stopPropagation()}
        className={`relative mx-auto w-full ${sizeClass}`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={`relative flex w-full flex-col overflow-hidden rounded-10 border-0 bg-white p-20 outline-none focus:outline-none dark:bg-emphasis`}
        >
          {isLoading && (
            <div
              className={
                'statusBar absolute -mt-20 h-6 w-full bg-green/25 -ms-20'
              }
            />
          )}
          <div className={'flex justify-between'}>
            <div>
              {typeof title === 'string' ? (
                <h2 className={'m-0'}>{title}</h2>
              ) : (
                title
              )}
            </div>
            <div>
              {showCloseButton ? (
                <button className={'p-4'} onClick={() => onCloseHandler(id)}>
                  <IconX className={'w-12'} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-hidden">{children}</div>
        </div>
      </m.div>
    </Overlay>
  );
};

const dropIn: Variants = {
  hidden: {
    y: '100vh',
    scale: 0.7,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      duration: 0.5,
      type: 'spring',
      damping: 20,
      mass: 1,
      stiffness: 200,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    scale: 0.7,
    transition: {
      duration: 0.5,
    },
  },
};
