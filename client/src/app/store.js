import {configureStore} from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import advocateReducer from '../features/advocate/advocateSlice';
import bookingReducer from '../features/bookingSlice';
import caseReducer from '../features/caseSlice';
import documentReducer from '../features/documentSlice';
import adminReducer from '../features/adminSlice';
import documentTemplateReducer from '../features/documentTemplateSlice';


const store = configureStore({
    reducer: {
        auth : authReducer,
        advocates : advocateReducer,
        booking : bookingReducer,
        case : caseReducer,
        document : documentReducer,
        admin : adminReducer,
        documentTemplate: documentTemplateReducer
    }
});

export default store;