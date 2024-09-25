import { create } from "zustand";

const deficiencyModalStore = create((set)=>({
    isShowDeficiencyModal:false,
    clearanceID:null,
    sentRequest:false,

    setDeficiencyModal: (show,id)=>{
        set({isShowDeficiencyModal:show,clearanceID:id})
    },

    requestSetter:(bool)=>{
        set({sentRequest:bool})
    }
}))

export default deficiencyModalStore;