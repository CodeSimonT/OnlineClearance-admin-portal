import Profile from "../components/cards/Profile";
import AddDepartmentModal from "../components/modals/AddDepartmentModal";
import DeficiencyModal from "../components/modals/DeficiencyModal";
import EditDepartmentModal from "../components/modals/EditDepartmentModal";
import Navbar from "../components/nav/Navbar";
import SideNav from "../components/nav/SideNav";
import ActiveRequestTable from "../components/table/ActiveRequestTable";
import DepartmentListTable from "../components/table/DepartmentListTable";
import MainLayout from "../pages/Layout/MainLayout";
import ActiveTerm from "../pages/Settings/ActiveTerm";
import ChangeEmailForm from "../pages/Settings/ChangeEmailForm";
import ChangePassword from "../pages/Settings/ChangePassword";
import ClearanceRequest from "../pages/Settings/ClearanceRequest";
import HomeSettings from "../pages/Settings/HomeSettings";
import ActiveRequestInfo from "../pages/activeRequest/ActiveRequestInfo";
import ActiveRequestList from "../pages/activeRequest/ActiveRequestList";
import HomeActiveRequest from "../pages/activeRequest/HomeActiveRequest";
import HomeDepartmentList from "../pages/departmentList/HomeDepartmentList";
import ForgotPassword from "../pages/forms/ForgotPassword";
import FormLayout from "../pages/forms/FormLayout";
import Login from "../pages/forms/Login";
import HomeStudentList from "../pages/studentList/HomeStudentList";
import deficiencyModalStore from "./store/deficiencyModalStore";
import editDepartmentModalStore from "./store/editDepartmentModalStore";
import newDepartmentModalStore from "./store/newDepartmentModalStore";
import LogedIn from "../authentication/LogedIn";
import ProtectedRoute from "../authentication/ProtectedRoute";
import cookie from "./cookie";
import SuccessToast from "../components/toast/SuccessToast";
import ErrorToast from "../components/toast/ErrorToast";
import Spinner from "../components/Spinner";
import fetchDepartment from "./fetchDepartment";

export {
    MainLayout,
    SideNav, 
    Navbar,
    Profile,
    FormLayout, 
    ForgotPassword, 
    Login,
    HomeActiveRequest, 
    HomeDepartmentList, 
    HomeStudentList, 
    HomeSettings,
    ActiveRequestTable,
    ActiveRequestList,
    ActiveRequestInfo,
    DepartmentListTable,
    DeficiencyModal,
    deficiencyModalStore,
    AddDepartmentModal,
    newDepartmentModalStore,
    EditDepartmentModal,
    editDepartmentModalStore,
    ChangeEmailForm, 
    ChangePassword, 
    ActiveTerm,
    ClearanceRequest,
    LogedIn,
    ProtectedRoute,
    cookie,
    SuccessToast, 
    ErrorToast,
    Spinner,
    fetchDepartment
}