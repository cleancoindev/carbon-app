import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { Overlay } from 'libs/modals/Overlay';
import { ModalProps } from 'libs/modals/modals.types';

export const ModalSheet: FC<ModalProps> = ({
  children,
  id,
  title,
  showCloseButton = true,
  isLoading = false,
  onClose,
}) => {
  const { closeModal } = useModal();
  const onCloseHandler = (id: string) => {
    onClose && onClose(id);
    closeModal(id);
  };

  return (
    <Overlay onClick={() => onCloseHandler(id)} className={'items-end'}>
      <m.div
        onClick={(e) => e.stopPropagation()}
        className={`w-full`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={`flex w-full flex-col overflow-hidden rounded-t-10 border-0 bg-white p-20 outline-none focus:outline-none dark:bg-emphasis`}
        >
          {isLoading && (
            <div
              className={
                'statusBar absolute -mt-20 -ml-20 h-6 w-full bg-green/25'
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

          <div className="overflow-y-hidden">{children}</div>
        </div>
      </m.div>
    </Overlay>
  );
};

const dropIn: Variants = {
  hidden: {
    height: '0%',
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      delay: 0,
      duration: 0.5,
    },
  },
  exit: {
    height: '0%',
    transition: {
      duration: 0.5,
    },
  },
};
