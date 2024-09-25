import { create } from "zustand";

const newDepartmentModalStore = create((set)=>({
    isShowDepartmentModal:false,

    setDepartmentModal: (show)=>{
        set({isShowDepartmentModal:show})
    }
}))

export default newDepartmentModalStore;