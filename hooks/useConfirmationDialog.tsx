/* 
    Usage - 

    Import:
        import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";

    Inside top level component: 
        const modalContext = useConfirmationDialogContext();

    Inside handler function when you are performing the operation:
        modalContext.showDialog("This text will be displayed in the dialog", () => {console.log("this function will be run if the user clicks ok")});
    
    - Check out @/components/EventRegistration/MemberControls.tsx for reference.
    - If the user clicks cancel, the dialog will simply close and no other function will be called. Your dialog text should be in this format - "Are you sure you want to perform XYZ action?" - so the user says yes to call the given function, no to simply close the dialog.

*/
"use client";

import { createContext, ReactNode, useContext, useRef, useState } from "react";

type ModalContextType = {
  showDialog: (dialogText: string, confirmFunction: () => void) => void;
};

const ConfirmationDialogContext = createContext<ModalContextType>(
  {} as ModalContextType,
);

export const ConfirmationDialogContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState("");
  const [handleConfirm, setHandleConfirm] = useState(() => () => {});

  const handleShow = (dialogText: string, confirmFunction: () => void) => {
    setText(dialogText);
    setHandleConfirm(() => confirmFunction);
    dialogRef.current?.showModal();
  };

  const handleCancel = () => {
    dialogRef.current?.close();
  };

  return (
    <ConfirmationDialogContext.Provider value={{ showDialog: handleShow }}>
      {children}
      <div className="fixed h-screen w-screen -z-10">
        <dialog
  ref={dialogRef}
  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-300 backdrop:bg-black/80 w-full sm:w-1/3 bg-black border border-white/20 p-0"
>
  <div className="flex flex-col items-center gap-6 px-8 py-8">
    {/* Header with decoration */}
    <div className="w-full flex items-center justify-center gap-4 text-white/40 text-xs tracking-widest font-mono">
      <div className="h-px w-12 bg-white/20"></div>
      <span>CONFIRM ACTION</span>
      <div className="h-px w-12 bg-white/20"></div>
    </div>

    <h3 className="text-2xl font-bold tracking-tight text-white uppercase">
      Confirmation
    </h3>
    
    <p className="text-white/70 text-center font-light leading-relaxed">{text}</p>
    
    <div className="flex w-full gap-4 border-t border-white/10 pt-6">
      <button
        onClick={() => {
          handleConfirm();
          dialogRef.current?.close();
        }}
        className="flex-1 border border-red-400 px-6 py-3 outline-none hover:bg-red-400 hover:text-black transition-all uppercase tracking-wider text-sm font-bold text-white"
      >
        Yes
      </button>
      <button
        onClick={handleCancel}
        className="flex-1 border border-white/30 px-6 py-3 outline-none hover:bg-white/10 transition-all uppercase tracking-wider text-sm font-bold text-white"
      >
        Cancel
      </button>
    </div>
  </div>
</dialog>
      </div>
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialogContext = (): ModalContextType =>
  useContext(ConfirmationDialogContext);
