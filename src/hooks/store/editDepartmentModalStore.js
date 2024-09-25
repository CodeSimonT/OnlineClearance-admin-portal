import { create } from "zustand";

const editDepartmentModalStore = create((set)=>({
    isShowEditModal:false,
    departmentData:null,

    setEditModal:(show,data)=>{
        set({isShowEditModal:show,departmentData:data})
    }
}))

export default editDepartmentModalStore;