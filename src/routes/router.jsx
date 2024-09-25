import { createBrowserRouter } from "react-router-dom";

import { ActiveRequestInfo, ActiveRequestList, ActiveTerm, ChangeEmailForm, ChangePassword, ClearanceRequest, DepartmentListTable, ForgotPassword, FormLayout, HomeActiveRequest, HomeDepartmentList, HomeSettings, HomeStudentList, LogedIn, Login, MainLayout, ProtectedRoute } from '../hooks/links'
import { authenticate } from "../authentication/auth";

export const router = createBrowserRouter([
    {
        path:'/',
        element:(
            <ProtectedRoute authenticate={authenticate}>
                <MainLayout/>
            </ProtectedRoute>
        ),
        children:[
            {
                path:'/',
                element:<HomeActiveRequest/>,
                children:[
                    {
                        path:'/',
                        element:<ActiveRequestList/>
                    },
                    // {
                    //     path:'request-information',
                    //     element:<ActiveRequestInfo/>
                    // }
                ]
            },
            {
                path:'student-list',
                element:<HomeStudentList/>,
                children:[]
            },
            {
                path:'department',
                element:<HomeDepartmentList/>,
                children:[
                    {
                        path:'/department/list',
                        element:<DepartmentListTable/>
                    }
                ]
            },
            {
                path:'settings',
                element:<HomeSettings/>,
                children:[
                    {
                        path:'/settings',
                        element:<ChangeEmailForm/>
                    },
                    {
                        path:'/settings/change-pass',
                        element:<ChangePassword/>
                    },
                    {
                        path:'/settings/active-term',
                        element:<ActiveTerm/>
                    },
                    {
                        path:'/settings/request-clearance',
                        element:<ClearanceRequest/>
                    },
                ]
            },
        ]
    },
    {
        path:'/form',
        element:(
            <LogedIn authenticate={authenticate}>
                <FormLayout/>
            </LogedIn>
        ),
        children:[
            {
                path:'login',
                element:<Login/>
            },
            {
                path:'forgotpassword',
                element:<ForgotPassword/>
            }
        ]
    }
])